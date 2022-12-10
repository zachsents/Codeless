import { SiGooglesheets } from "react-icons/si"
import { BoxAlignLeft } from "tabler-icons-react"
import { ControlStack } from "../../components"
import { SheetNameControl, SpreadsheetIDControl } from "./shared"


export default {
    name: "Set Named Column",
    description: "Sets the data in a named column in a table.",
    icon: BoxAlignLeft,
    color: "green",
    valueTargets: [
        // { name: "spreadsheetId", label: "Spreadsheet ID" },
        // "sheetName",
        "columnName",
        "data",
    ],
    signalTargets: [" "],
    signalSources: ["  "],

    defaultState: { 
        spreadsheetId: "",
        sheetName: "",
    },

    configuration: props => {
        return (
            <ControlStack>
                <SpreadsheetIDControl {...props} />
                <SheetNameControl {...props} />
            </ControlStack>
        )
    }
}