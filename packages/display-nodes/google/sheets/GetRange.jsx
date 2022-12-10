import { SiGooglesheets } from "react-icons/si"
import { BoxAlignTopLeft } from "tabler-icons-react"
import { ControlStack } from "../../components"
import { Dimension, MajorDimensionControl, SpreadsheetIDControl } from "./shared"


export default {
    name: "Get Range",
    description: "Gets values from a range in a Google Sheet.",
    icon: BoxAlignTopLeft,
    color: "green",
    valueTargets: [
        // { name: "spreadsheetId", label: "Spreadsheet ID" },
        "range"
    ],
    valueSources: [" "],

    defaultState: { 
        spreadsheetId: "",
        majorDimension: Dimension.Rows,
    },

    configuration: props => {
        return (
            <ControlStack>
                <SpreadsheetIDControl {...props} />
                <MajorDimensionControl {...props} />
            </ControlStack>
        )
    }
}