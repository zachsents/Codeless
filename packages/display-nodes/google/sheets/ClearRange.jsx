import { SquareOff } from "tabler-icons-react"
import { ControlStack } from "../../components"
import { SpreadsheetIDControl } from "./shared"


export default {
    name: "Clear Range",
    description: "Clears values in a specific range from a Sheet.",
    icon: SquareOff,
    color: "green",
    valueTargets: [
        // { name: "spreadsheetId", label: "Spreadsheet ID" }, 
        "range",
    ],
    signalTargets: [" "],

    defaultState: { 
        spreadsheetId: "",
    },

    configuration: props => {
        return (
            <ControlStack>
                <SpreadsheetIDControl {...props} />
            </ControlStack>
        )
    }
}