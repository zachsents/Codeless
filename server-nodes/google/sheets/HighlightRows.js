import "./shared.js"
import convert from "color-convert"


export default {
    id: "googlesheets:HighlightRows",

    inputs: ["rows", "$color", "$mode"],

    /**
     * @param {object} inputs
     * @param {import("./shared.js").GoogleSpreadsheetCellRow[]} inputs.rows
     * @param {string} inputs.$color
     * @param {"background" | "border"} inputs.$mode
     */
    async onInputsReady({ rows, $color, $mode }) {

        // Quit if there are no rows
        if (!rows.length)
            return

        // Split up color
        const [red, green, blue] = convert.hex.rgb($color)
        const colorObj = {
            red: red / 255,
            green: green / 255,
            blue: blue / 255,
        }

        // Update cells
        rows.forEach(row => {
            Object.entries(row.data).forEach(([header, cell]) => {
                const isFirst = row._sheet.headerValues.indexOf(header) == 0
                const isLast = row._sheet.headerValues.indexOf(header) == row._sheet.headerValues.length - 1

                switch ($mode) {
                    case "background":
                        cell.backgroundColor = colorObj
                        break
                    case "border":
                        // eslint-disable-next-line no-case-declarations
                        const borderObj = {
                            style: "SOLID",
                            width: 1,
                            color: colorObj,
                        }
                        cell.borders = {
                            top: borderObj,
                            bottom: borderObj,
                            ...isFirst && { left: borderObj },
                            ...isLast && { right: borderObj },
                        }
                }
            })
        })

        // Save updates
        await rows[0]._sheet.saveUpdatedCells()
    },
}