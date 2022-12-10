import { BoxAlignTopLeft } from "tabler-icons-react"
import { SiGooglesheets } from "react-icons/si"
import { Dimension, MajorDimensionControl, SpreadsheetIDControl } from "./shared"
import { ControlStack } from "../../components"


export default {
    name: "Set Range",
    description: "Sets values in a range in a Google Sheet.",
    icon: BoxAlignTopLeft,
    color: "green",
    valueTargets: [
        // { name: "spreadsheetId", label: "Spreadsheet ID" },
        "range",
        "values",
    ],
    signalTargets: [" "],
    signalSources: ["  "],

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