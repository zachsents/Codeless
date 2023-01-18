import { SheetReference } from "./types.js"


export default {
    id: "googlesheets:Spreadsheet",
    name: "Spreadsheet",

    inputs: [],
    outputs: ["_sheetRef"],

    onStart() {
        this.publish({
            _sheetRef: new SheetReference(this.state.spreadsheetId, this.state.sheetName)
        })
    },
}