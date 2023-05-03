import { logger } from "../logger.js"
import { Operation } from "../types/Operation.js"
import { deepFlat } from "../util.js"
import { AirtableFormula } from "./formulas.js"


/**
 * @typedef {import("airtable").Table<import("airtable").FieldSet>} ATTable
 * @typedef {import("airtable").Record<import("airtable").FieldSet>} ATRecord
 */


export class Row {

    /**
     * Creates an instance of Row.
     * @param {Table} table
     * @param {ATRecord} atRecord
     * @memberof Row
     */
    constructor(table, atRecord) {
        this.table = table
        this.atRecord = atRecord
    }

    get data() {
        return this.atRecord.fields
    }

    getField(field) {
        return this.data[field]
    }

    toString() {
        return "Airtable Record"
    }
}


export class Table {

    /**
     * @type {ATTable}
     * @memberof Table
     */
    atTable

    /**
     * Creates an instance of Table.
     * @param {ATTable} atTable
     * @memberof Table
     */
    constructor(atTable) {
        this.atTable = atTable
    }

    /**
     * @param {object} options
     * @param {Condition[]} options.filters
     * @param {number} [options.limit]
     * @param {string} [options.sortBy]
     * @param {"asc" | "desc"} [options.sortOrder]
     * @memberof Table
     */
    async findRows({
        filters,
        limit,
        sortBy,
        sortOrder = "asc"
    } = {}) {

        logger.setPrefix("Airtable - Find Rows")

        // compile filters
        let filterFormula

        // if there's a single string, we'll treat it as a user-entered formula
        if (typeof filters?.[0] == "string" && filters.length == 1) {
            filterFormula = filters[0]
        }
        // otherwise, we'll treat it as an Operation
        else {
            filterFormula = Operation.And(...deepFlat(filters))
                .toString(AirtableFormula.ParamMappings, AirtableFormula.OperationMappings)
        }

        logger.table({ filters: filters.length, limit, sortBy, sortOrder })
        logger.debug("Filter Formula:", filterFormula)

        // make request
        const records = await this.atTable.select({
            filterByFormula: filterFormula,
            ...(limit != null && { maxRecords: limit }),
        }).all()

        // without sorting, Airtable tends to give these records in
        // reverse order
        if (!sortBy)
            records.reverse()

        // turn into row objects
        const rows = records.map(record => this.row(record))

        return rows
    }

    /**
     * Adds rows to the Airtable table.
     *
     * @param {object[]} [newRowData=[]]
     * @return {Row[]} The newly added rows
     * @memberof Table
     */
    async addRows(newRowData = []) {
        const newRecords = await this.atTable.create(
            newRowData.map(fields => ({ fields })),
            { typecast: true }
        )
        return newRecords.map(record => this.row(record))
    }

    /**
     * Batch updates rows in the Airtable table.
     *
     * @param {Array<{ row: Row, data: object }>} [updates=[]]
     * @return {Row[]} The updated rows
     * @memberof Table
     */
    async updateRows(updates = []) {
        // map into form the API accepts
        const updatePayloads = updates.map(update => ({
            id: update.row.atRecord.id,
            fields: update.data,
        }))

        // make request
        const updatedRecords = await this.atTable.update(updatePayloads, { typecast: true })

        // map to our Row objects
        return updatedRecords.map(record => this.row(record))
    }

    /**
     * Batch deletes rows from the Airtable table.
     *
     * @param {Row[]} [rows=[]]
     * @memberof Table
     */
    async deleteRows(rows = []) {
        // map to record IDs
        const recordIds = rows.map(row => row.atRecord.id)

        // make request
        await this.atTable.destroy(recordIds)
    }

    row(...args) {
        return new Row(this, ...args)
    }

    toString() {
        return "Airtable Table"
    }
}
