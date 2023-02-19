import { logger } from "../logger.js"
import { Operation } from "../types/Operation.js"
import { deepFlat } from "../util.js"
import { AirtableFormula } from "./formulas.js"


/**
 * @typedef {import("airtable").Table<import("airtable").FieldSet>} ATTable
 */


export class Row {

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
            filterFormula = deepFlat(filters)
                |> Operation.And(...^^)
                |> ^^.toString(AirtableFormula.ParamMappings, AirtableFormula.OperationMappings)
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
        if(!sortBy)
            records.reverse()

        // turn into row objects
        const rows = records.map(record => this.row(record))

        return rows
    }

    row(...args) {
        return new Row(this, ...args)
    }

    toString() {
        return "Airtable Table"
    }
}

