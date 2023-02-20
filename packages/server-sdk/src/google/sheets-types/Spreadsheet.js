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
        if (keys)
            return result.map((data, i) => [keys[i], data])
                |> Object.fromEntries(^^)

        // otherwise, just return array
        return result
    }

    /**
     * Batch updates ranges in a spreadsheet.
     * 
     * Updated rows are returned in the same order in which the updates were provided.
     *
     * @param {Array<{ range: Range | string, values: *[][] }>} updates
     * @param {object} [options]
     * @param {"USER_ENTERED" | "RAW"} [options.valueInputOption]
     * @param {boolean} [options.includeValuesInResponse]
     * @param {"UNFORMATTED_VALUE" | "FORMATTED_VALUE" | "FORMULA"} [options.valueInputOption]
     * @param {"ROWS" | "COLUMNS"} [options.majorDimension]
     * @param {boolean} [options.oneDimensional]
     * @memberof Spreadsheet
     */
    async batchUpdate(updates, {
        valueInputOption = "USER_ENTERED",
        includeValuesInResponse = true,
        responseValueRenderOption = "UNFORMATTED_VALUE",
        majorDimension = "ROWS",
        oneDimensional = false,
    } = {}) {

        // make request
        const { data: { responses } } = await this.api.spreadsheets.values.batchUpdate({
            spreadsheetId: this.id,
            requestBody: {
                valueInputOption,
                includeValuesInResponse,
                responseValueRenderOption,
                data: updates.map(update => ({
                    values: oneDimensional ? [update.values] : update.values,
                    range: update.range.toString(),
                    majorDimension,
                })),
            }
        })

        // function to help with upcoming sort
        const sortTransform = x => updates.findIndex(up => Range.stringsEqual(up.range, x.updatedData.range))

        // sort and map
        const result = responses
            // sort into same order as original ranges array
            .sort((a, b) => sortTransform(a) - sortTransform(b))
            // if the data is 1D, then we'll just grab the first element
            .map(resp => oneDimensional ? resp.updatedData.values[0] : resp.updatedData.values)

        return result
    }

    /**
     * Batch clears values from a Spreadsheet.
     *
     * @param {Array<Range | string>} ranges
     * @memberof Spreadsheet
     */
    async batchClear(ranges) {

        // make request
        await this.api.spreadsheets.values.batchClear({
            spreadsheetId: this.id,
            requestBody: {
                ranges: ranges.map(range => range.toString())
            }
        })
    }

    /**
     * Deletes rows.
     *
     * @param {string} sheetName
     * @param {number[]} rows Row number (1-indexed)
     * @memberof Spreadsheet
     */
    async deleteRows(sheetName, rows) {

        // find sheet ID
        const fullDetails = await this.getDetails({ returnFullOutput: true })
        const sheetId = fullDetails.sheets.find(sheet => sheet.properties.title == sheetName)?.properties.sheetId

        if(!sheetId)
            throw new Error(`Can't find sheet "${sheetName}"`)

        // combine into ranges of rows
        const sorted = [...rows].sort((a, b) => a - b)
        const ranges = [{ start: sorted[0], end: sorted[0] }]
        sorted.reduce((last, current) => {
            if(current - last <= 1)
                ranges[0].end = current
            else
                ranges.unshift({ start: current })
            return current
        })

        // build requests
        const requests = ranges.map(range => ({
            deleteDimension: {
                range: {
                    sheetId,
                    dimension: "ROWS",
                    startIndex: range.start - 1,
                    endIndex: range.end,
                }
            }
        }))

        // make request
        await this.api.spreadsheets.batchUpdate({
            spreadsheetId: this.id,
            requestBody: {
                requests,
            }
        })
    }
}
