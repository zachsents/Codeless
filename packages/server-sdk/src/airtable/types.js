import Airtable from "airtable"
import { logger } from "../logger.js"
import { convertConditionStructureToFormula } from "./formulas.js"


export class Row {

    constructor(table, atRecord) {
        this.table = table
        this.atRecord = atRecord
    }

    get data() {
        return this.atRecord.fields
    }

    get(field) {
        return this.data[field]
    }

    toString() {
        return "Airtable Record"
    }
}

export class Table {

    /**
     * @type {Airtable.Table}
     * @memberof Table
     */
    atTable

    /**
     * Creates an instance of Table.
     * @param {Airtable.Table} atTable
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
        const filterFormula = convertConditionStructureToFormula(
            filters.reduce((joined, filter) => joined.and(filter)).structure
        )

        logger.table({ filters: filters.length, limit, sortBy, sortOrder, filterFormula })

        // make request
        const records = await this.atTable.select({
            filterByFormula: filterFormula,
            ...(limit != null && { maxRecords: limit }),
        }).all()

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

