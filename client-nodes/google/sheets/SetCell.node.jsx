import { ClipboardData, SquareAsterisk } from "tabler-icons-react"
import { SheetInput } from "./shared/inputs"
import { SheetsIcon } from "./shared/misc"
import InferControl from "../../components/InferControl"
import { InputMode, useInputMode, useInputValue } from "../../hooks/nodes"


export default {
    id: "googlesheets:SetCell",
    name: "Set Cell",
    description: "Set a cell's value in a Google Sheet.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets", "Tables", "Database"],

    inputs: [
        SheetInput,
        {
            id: "cell",
            description: "The cell to retrieve the value from. e.g. A1, B2, etc.",
            tooltip: "The cell to retrieve the value from. e.g. A1, B2, etc.",
            icon: SquareAsterisk,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
        {
            id: "value",
            description: "The value to set the cell as.",
            tooltip: "The value to set the cell as.",
            icon: ClipboardData,
            allowedModes: ["handle", "config"],
            defaultMode: "handle",
            renderConfiguration: InferControl,
        },
    ],

    renderName: () => {
        const [cell] = useInputValue(null, "cell")
        const [cellMode] = useInputMode(null, "cell")

        return `Set Cell${cellMode == InputMode.Config && cell ? ` ${cell}` : ""}`
    },
}
