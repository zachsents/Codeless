import { Range } from "./types.js"


export async function getEntireSheetValues(sheetsApi, { spreadsheetId, sheetName, majorDimension }) {

    // get info about sheet
    let response = await sheetsApi.spreadsheets.get({
        spreadsheetId,
        ranges: [],
        includeGridData: false,
    })

    // if no sheet name is provided, just get the first sheet
    const sheet = sheetName ?
        response.data.sheets.find(sheet => sheet.properties.title == sheetName) :
        response.data.sheets[0]

    // create range that encompasses entire sheet
    const encompassingRange = new Range(
        sheet.properties.title,
        1,
        1,
        sheet.properties.gridProperties.rowCount,
        sheet.properties.gridProperties.columnCount
    )

    // read values
    response = await sheetsApi.spreadsheets.values.get({
        spreadsheetId,
        range: encompassingRange.toString(),
        majorDimension,
        valueRenderOption: "UNFORMATTED_VALUE",
    })

    return [response.data.values, encompassingRange]
}