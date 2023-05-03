import { logger } from "../../logger.js"
import { deepFlat } from "../../util.js"
import { Operation, TableField } from "../../types/index.js"
import { Row } from "./Row.js"
import { Range } from "./Range.js"


export class Table {

    /**
     * Creates an instance of Table.
     * @param {import("./Range.js").Range} dataRange
     * @param {object} [options]
     * @param {string[]} [options.fields]
     * @memberof Table
     */
    constructor(dataRange, { fields } = {}) {
        this.dataRange = dataRange
        this.fields = fields
    }

    get sheet() {
        return this.dataRange.sheet
    }

    get spreadsheet() {
        return this.dataRange.spreadsheet
    }

    get api() {
        return this.dataRange.api
    }

    row(...args) {
        return new Row(this, ...args)
    }

    /**
     * @param {object} options
     * @param {Operation[]} options.filters
     * @param {number} [options.limit]
     * @param {string} [options.sortBy]
     * @param {"asc" | "desc"} [options.sortOrder]
     * @memberof Table
     */
    async findRows({
        filters,
        limit,
        sortBy,
        sortOrder = "asc",
    } = {}) {

        logger.setPrefix("Google Sheets - Find Rows")
        logger.table({ filters: filters.length, limit, sortBy, sortOrder })

        // compile filters
        /** @type {boolean | Operation} */
        const joinedFilter = Operation.And(...deepFlat(filters))

        logger.debug("Filter:")
        logger.debug(joinedFilter, "\n")

        // find which columns we need to get
        const filterFields = [...new Set(
            // if joinedFilter is a boolean, then we don't need to get any fields
            (joinedFilter.flatParams ?? []).filter(param => param instanceof TableField).map(tf => tf.field)
        )]

        // build ranges for those fields
        const ranges = filterFields.map(field => {
            const col = this.dataRange.startColumn + this.fields.indexOf(field)
            return this.dataRange.absolute(null, col, null, col)
        })

        let filteredRows

        // if there's no ranges, we should just evaluate the filter condition
        if (ranges.length == 0) {
            logger.debug("No field ranges to query")

            // first see if condition is falsey
            if (!joinedFilter.valueOf())
                return logger.debug("Condition is false. Returning empty set."), []

            logger.debug("Condition is truthy. Continuing.")

            // if we're not sorting, limit here
            const range = sortBy || limit == null ?
                this.dataRange.toString() :
                this.dataRange.absolute(null, null, Math.min(this.dataRange.startRow + limit - 1, this.dataRange.endRow), null).toString()

            // grab entire spreadsheet
            const { data } = await this.api.spreadsheets.values.get({
                spreadsheetId: this.spreadsheet.id,
                range,
                majorDimension: "ROWS",
                valueRenderOption: "UNFORMATTED_VALUE",
            })

            // map into rows
            filteredRows = data.values.map((rowValues, i) => {
                const rowData = this.fields ?
                    Object.fromEntries(
                        rowValues.map((val, i) => [this.fields[i], val])
                    ) :
                    rowValues
                return this.row(i, rowData)
            })
        }
        else {
            logger.debug("Querying field ranges")

            // query the column ranges
            const columnData = await this.spreadsheet.batchGet(ranges, {
                majorDimension: "COLUMNS",
                keys: filterFields,
                oneDimensional: true,
            })

            // calculate number of rows we have
            const numRows = Math.max(...Object.values(columnData).map(data => data.length))

            // transform the data into records
            const records = Array(numRows).fill(0).map(
                (_, i) => ({
                    ...Object.fromEntries(
                        filterFields.map(field => [field, columnData[field][i]])
                    ),
                    _index: i
                })
            )

            // filter the records & turn them into ranges
            let filteredRecords = records.filter(
                record => joinedFilter.substitute(TableField, tf => record[tf.field]).valueOf()
            )

            logger.debug(`Filtered from ${records.length} to ${filteredRecords.length} row(s)`)

            // if we're not sorting, then limit before we fetch
            if (!sortBy && limit != null)
                filteredRecords = filteredRecords.slice(0, limit)

            // if there's no results, bail early
            if (filteredRecords.length == 0)
                return []

            // create rows
            filteredRows = filteredRecords.map(record => this.row(record._index))

            // fetch those rows' ranges
            const rowData = await this.spreadsheet.batchGet(
                filteredRows.map(row => row.range()),
                { oneDimensional: true }
            )

            // add data to each row object
            rowData.forEach((data, i) => {
                filteredRows[i].data = this.fields ?
                    Object.fromEntries(
                        data.map((val, j) => [this.fields[j], val])
                    ) :
                    data
            })
        }

        logger.debug(`Got ${filteredRows.length} row(s)`)

        // sort & limit
        if (sortBy) {
            filteredRows = filteredRows.sort((rowA, rowB) => {
                const a = rowA.get(sortBy)
                const b = rowB.get(sortBy)
                switch (sortOrder) {
                    case "asc": return a == b ? 0 : a > b ? -1 : 1
                    case "desc": return a == b ? 0 : a < b ? -1 : 1
                    default: return 0
                }
            }).slice(0, limit ?? undefined)
        }

        return filteredRows
    }

    /**
     * Adds new rows to the Google Sheets table.
     *
     * @param {object[]} [newRowData=[]]
     * @return {Row[]} The newly added rows
     * @memberof Table
     */
    async addRows(newRowData = []) {

        // make request
        const { data: { updates: { updatedData } } } = await this.api.spreadsheets.values.append({
            spreadsheetId: this.spreadsheet.id,
            range: this.dataRange.toString(),
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            includeValuesInResponse: true,
            responseValueRenderOption: "UNFORMATTED_VALUE",
            requestBody: {
                majorDimension: "ROWS",
                values: newRowData.map(newRow => this.fields.map(field => newRow[field] ?? null)),
            }
        })

        // parse range of new rows
        const newDataRange = Range.fromString(updatedData.range)

        // map to rows and return
        return updatedData.values.map(
            (rowData, i) => this.row(
                newDataRange.startRow + i - this.dataRange.startRow,
                Object.fromEntries(
                    this.fields.map((field, j) => [field, rowData[j]])
                )
            )
        )
    }

    /**
     * Batch updates rows in the Google Sheets table.
     *
     * @param {Array<{ row: Row, data: object }>} [updates=[]]
     * @return {Row[]} The updated rows
     * @memberof Table
     */
    async updateRows(updates = []) {
        // put updates in a form the API accepts
        const updatePaylods = updates.map(update => ({
            range: update.row.range(),
            values: Row.recordToArray(update.data, this.fields),
        }))

        // make request
        const updatedRows = await this.spreadsheet.batchUpdate(updatePaylods, {
            oneDimensional: true,
        })

        // map to new row objects with updated data
        return updatedRows.map((updatedData, i) => Object.assign(this.row(), updates[i].row, {
            data: Row.arrayToRecord(updatedData, this.fields)
        }))
    }

    /**
     * Batch deletes rows from the Google Sheets table.
     *
     * @param {Row[]} [rows=[]]
     * @memberof Table
     */
    async deleteRows(rows = []) {
        await this.spreadsheet.deleteRows(
            this.sheet.name,
            rows.map(row => row.range().startRow)
        )
    }
}
