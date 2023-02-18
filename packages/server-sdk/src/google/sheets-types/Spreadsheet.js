import { Sheet } from "./Sheet.js"


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
}
