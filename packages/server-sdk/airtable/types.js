import Airtable from "airtable"


export class Table extends Airtable.Table {

    /**
     * @param {object} options
     * @param {*} options.filter
     * @param {number} [options.limit]
     * @param {string} [options.sortBy]
     * @param {"asc" | "desc"} [options.sortOrder]
     * @memberof Table
     */
    async findRows({
        filter,
        limit,
        sortBy,
        sortOrder = "asc"
    } = {}) {
        
    }

    createFilter({ 
        field, 
        compareFunction = "Equals",
        searchValue,
    } = {}) {

    }
}

