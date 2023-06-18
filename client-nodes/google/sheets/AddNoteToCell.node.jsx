import { Message, SquareAsterisk } from "tabler-icons-react"
import TextAreaControl from "../../components/TextAreaControl"
import { InputMode, useInputMode, useInputValue } from "../../hooks/nodes"
import { SheetInput } from "./shared/inputs"
import { SheetsIcon } from "./shared/misc"
import ErrorText from "../../components/ErrorText"


export default {
    id: "googlesheets:AddNoteToCell",
    name: "Add Note to Cell",
    description: "Add a note to a cell in a Google Sheet.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets", "Tables", "Database"],

    inputs: [
        SheetInput,
        {
            id: "cell",
            description: "The cell to add a note to. e.g. A1, B2, etc.",
            tooltip: "The cell to add a note to. e.g. A1, B2, etc.",
            icon: SquareAsterisk,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
        {
            id: "note",
            description: "The note to add to the cell.",
            tooltip: "The note to add to the cell.",
            icon: Message,
            allowedModes: ["handle", "config"],
            defaultMode: "handle",
            renderConfiguration: TextAreaControl,
        },
    ],

    renderName: () => {
        const [cell] = useInputValue(null, "cell")
        const [cellMode] = useInputMode(null, "cell")

        return `Add Note to Cell${cellMode == InputMode.Config && cell ? ` ${cell}` : ""}`
    },

    renderContent: () => {
        const [cell] = useInputValue(null, "cell")
        const [cellMode] = useInputMode(null, "cell")

        if (cellMode == InputMode.Config && !cell) return <ErrorText>No cell provided</ErrorText>
    },
}
