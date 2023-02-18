import { logger } from "../../logger.js"
import { deepFlat } from "../../util.js"
import { Operation, TableField } from "../../types/index.js"
import { Range } from "./Range.js"
import { Row } from "./Row.js"


export class Table {

    /**
     * Creates an instance of Table.
     * @param {Range} dataRange
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
        const joinedFilter = Operation.And(...deepFlat(filters))

        logger.debug("Filter:")
        logger.debug(joinedFilter, "\n")

        // find which columns we need to get
        const filterFields = [...new Set(
            joinedFilter.flatParams.filter(param => param instanceof TableField).map(tf => tf.field)
        )]

        // build ranges for those fields
        const ranges = filterFields.map(field => {
            const column = this.dataRange.startColumn + this.fields.indexOf(field)
            return this.dataRange.absolute(null, column, null, column).toString()
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
                const row = this.row(i)
                row.data = this.fields ?
                    rowValues.map((val, i) => [this.fields[i], val]) |> Object.fromEntries(^^) :
                    rowValues
                return row
            })
        }
        else {
            logger.debug("Querying field ranges")

            // query the column ranges
            const { data } = await this.api.spreadsheets.values.batchGetByDataFilter({
                spreadsheetId: this.spreadsheet.id,
                requestBody: {
                    dataFilters: ranges.map(a1Range => ({ a1Range })),
                    majorDimension: "COLUMNS",
                    valueRenderOption: "UNFORMATTED_VALUE",
                }
            })

            // transform the data into records
            const values = filterFields.map(
                (_, i) => data.valueRanges.find(vr => Range.stringsEqual(vr.valueRange.range, ranges[i]))?.valueRange.values[0]
            )
            const numRows = values[0]?.length ?? 0
            const records = Array(numRows).fill(0).map(
                (_, i) => ({
                    ...Object.fromEntries(
                        filterFields.map((field, j) => [field, values[j][i]])
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

            filteredRows = filteredRecords.map(record => this.row(record._index))
            const filteredRowRanges = filteredRows.map(row => row.range().toString())

            // fetch those ranges
            const { data: rowData } = await this.api.spreadsheets.values.batchGetByDataFilter({
                spreadsheetId: this.spreadsheet.id,
                requestBody: {
                    dataFilters: filteredRowRanges.map(a1Range => ({ a1Range })),
                    majorDimension: "ROWS",
                    valueRenderOption: "UNFORMATTED_VALUE",
                }
            })

            // add data to each row object
            rowData.valueRanges.forEach(vr => {
                const index = filteredRowRanges.findIndex(range => Range.stringsEqual(range, vr.valueRange.range))

                filteredRows[index].data = this.fields ?
                    vr.valueRange.values[0].map((val, i) => [this.fields[i], val]) |> Object.fromEntries(^^) :
                    vr.valueRange.values[0]
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
}
