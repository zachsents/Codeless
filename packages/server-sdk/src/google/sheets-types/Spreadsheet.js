import { Sheet } from "./Sheet.js"
import { Range } from "./Range.js"

export class Spreadsheet {

    /**
     * Creates an instance of Spreadsheet.
     * @param {import("./ExtendedGoogleSheetsAPI.js").ExtendedGoogleSheetsAPI} api
     * @param {string} id
     * @memberof Spreadsheet
     */
    constructor(api, id) {
        this.api = api
        this.id = id
    }

    sheet(name) {
        return new Sheet(this, name)
    }

    async getDetails({
        returnFullOutput = false,
        ranges = [],
        includeGridData = false,
        ...otherOptions
    } = {}) {
        // get info about sheet
        let { data } = await this.api.spreadsheets.get({
            spreadsheetId: this.id,
            ranges,
            includeGridData,
            ...otherOptions
        })

        // either return everything or just basic info
        return returnFullOutput ? data : {
            name: data.properties.title,
            sheets: data.sheets.map(s => s.properties.title)
        }
    }


    /**
     * Gets multiple ranges at once.
     * 
     * By default, results are returned in an array in the same order
     * as the provided ranges. If "keys" argument is provided, the result will 
     * be an object with these keys.
     *
     * @param {Array<Range | string>} ranges
     * @param {object} [options]
     * @param {"ROWS" | "COLUMNS"} [options.majorDimension]
     * @param {string} [options.valueRenderOption]
     * @param {string[]} [options.keys] 
     * @param {boolean} [options.oneDimensional]
     * @memberof Spreadsheet
     */
    async batchGet(ranges, {
        majorDimension = "ROWS",
        valueRenderOption = "UNFORMATTED_VALUE",
        keys,
        oneDimensional = false,
        ...otherOptions
    } = {}) {

        // turn ranges into data filters
        const dataFilters = ranges.map(range => {
            if (range instanceof Range | typeof range == "string")
                return { a1Range: range.toString() }

            throw new Error("Invalid range passed to Spreadsheet.batchGet")
        })

        // make request
        const { data } = await this.api.spreadsheets.values.batchGetByDataFilter({
            spreadsheetId: this.id,
            requestBody: {
                dataFilters,
                majorDimension,
                valueRenderOption,
                ...otherOptions,
            }
        })

        // function to help with upcoming sort
        const sortTransform = x => ranges.findIndex(r => Range.stringsEqual(r, x.valueRange.range))

        const result = data.valueRanges
            // sort into same order as original ranges array
            .sort((a, b) => sortTransform(a) - sortTransform(b))
            // if the data is 1D, then we'll just grab the first element
            .map(vr => oneDimensional ? vr.valueRange.values[0] : vr.valueRange.values)

        // if keys are provided, map them in and return an object
        if(keys)
            return result.map((data, i) => [keys[i], data])
            |> Object.fromEntries(^^)

        // otherwise, just return array
        return result
    }
}
