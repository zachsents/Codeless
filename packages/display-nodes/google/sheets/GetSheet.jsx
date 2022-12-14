import { SiGooglesheets } from "react-icons/si"
import { TableExport } from "tabler-icons-react"
import { ControlStack } from "../../components"
import { Dimension, MajorDimensionControl, SheetNameControl, SpreadsheetIDControl } from "./shared"


export default {
    name: "Get Sheet",
    description: "Gets the data from an entire Sheet.",
    icon: TableExport,
    color: "green",
    valueTargets: [
        // { name: "spreadsheetId", label: "Spreadsheet ID" },
        // "sheetName",
    ],
    valueSources: [" "],

    defaultState: { 
        spreadsheetId: "",
        sheetName: "",
        majorDimension: Dimension.Rows,
    },

    configuration: props => {
        return (
            <ControlStack>
                <SpreadsheetIDControl {...props} />
                <SheetNameControl {...props} />
                <MajorDimensionControl {...props} />
            </ControlStack>
        )
    }
}