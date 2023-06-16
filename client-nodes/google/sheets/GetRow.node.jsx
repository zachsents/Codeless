import NumberControl from "../../components/NumberControl"
import { List, Numbers } from "tabler-icons-react"
import { InputMode, useInputMode, useInputValue } from "../../hooks/nodes"
import { SheetInput } from "./shared/inputs"
import { SheetsIcon } from "./shared/misc"


export default {
    id: "googlesheets:GetRow",
    name: "Get Row",
    description: "Gets a row from a Google Sheet using the row number.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets", "Tables", "Database"],

    inputs: [
        SheetInput,
        {
            id: "index",
            name: "Row Number",
            description: "The row number to get.",
            tooltip: "The row number to get.",
            icon: Numbers,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            renderConfiguration: props => <NumberControl {...props} inputProps={{
                min: 1,
            }} />,
        },
    ],
    outputs: [
        {
            id: "row",
            description: "The row that was retrieved.",
            tooltip: "The row that was retrieved.",
            icon: List,
        },
    ],

    renderName: () => {
        const [index] = useInputValue(null, "index")
        const [indexMode] = useInputMode(null, "index")

        return `Get Row${indexMode == InputMode.Config && index ? ` ${index}` : ""}`
    },
}
