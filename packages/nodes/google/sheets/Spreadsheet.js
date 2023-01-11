import { SheetReference } from "./types.js"


export default {
    id: "googlesheets:Spreadsheet",
    name: "Spreadsheet",

    inputs: [],
    outputs: ["sheetRef"],

    onStart() {
        this.publish({
            sheetRef: new SheetReference(this.state.spreadsheetId, this.state.sheetName)
        })
    },
}