import { SiGooglesheets } from "react-icons/si"
import { ControlStack } from "../../components"
import { SheetNameControl, SpreadsheetIDControl } from "./shared"


export default {
    id: "googlesheets:Spreadsheet",
    name: "Spreadsheet",
    description: "Gets a sheet from your Google Drive.",
    icon: SiGooglesheets,
    color: "green",
    
    inputs: [],
    outputs: ["_sheetRef"],

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