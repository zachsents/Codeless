import { ClipboardData, SquareAsterisk } from "tabler-icons-react"
import { SheetInput } from "./shared/inputs"
import { SheetsIcon } from "./shared/misc"
import { InputMode, useInputMode, useInputValue } from "../../hooks/nodes"
import ErrorText from "../../components/ErrorText"


export default {
    id: "googlesheets:GetCell",
    name: "Get Cell",
    description: "Get a cell from a Google Sheet.",
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
    ],
    outputs: [
        {
            id: "value",
            description: "The value from the cell.",
            tooltip: "The value from the cell.",
            icon: ClipboardData,
        },
    ],

    renderName: () => {
        const [cell] = useInputValue(null, "cell")
        const [cellMode] = useInputMode(null, "cell")

        return `Get Cell${cellMode == InputMode.Config && cell ? ` ${cell}` : ""}`
    },

    renderContent: () => {
        const [cell] = useInputValue(null, "cell")
        const [cellMode] = useInputMode(null, "cell")

        if (cellMode == InputMode.Config && !cell) return <ErrorText>No cell provided</ErrorText>
    },
}
