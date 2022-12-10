import { Stack } from "@mantine/core"
import { SiGooglesheets } from "react-icons/si"
import { ControlStack } from "../../components"
import { Dimension, MajorDimensionControl, SpreadsheetIDControl } from "./shared"


export default {
    name: "Append Values",
    description: "Appends values to a table in a Sheet.",
    icon: SiGooglesheets,
    color: "green",
    valueTargets: [
        // { name: "spreadsheetId", label: "Spreadsheet ID" }, 
        { name: "range", label: "Table Range" }, 
        "values",
    ],
    signalTargets: [" "],

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