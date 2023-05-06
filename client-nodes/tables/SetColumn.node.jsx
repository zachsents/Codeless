import { LayoutList, RowInsertBottom, SquareX, Table } from "tabler-icons-react"
import B from "../components/B"
import { InputMode, useInputMode, useInputValue } from "../hooks/nodes"


export default {
    id: "tables:SetColumn",
    name: "Set Field",
    description: "Sets a field's value in a table or row.",
    icon: Table,
    color: "yellow",

    tags: ["Tables"],

    inputs: [
        {
            id: "rows",
            description: "The row(s) to set the field in.",
            tooltip: "The row(s) to set the field in.",
            icon: LayoutList,
        },
        {
            id: "field",
            description: "The field to set the data in.",
            tooltip: "The field to set the data in.",
            icon: RowInsertBottom,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
        {
            id: "value",
            description: "The value to set.",
            tooltip: "The value to set.",
            icon: SquareX,
            allowedModes: ["handle", "config"],
        },
    ],
    outputs: [],

    renderTextContent: () => {
        const [field] = useInputValue(null, "field")
        const [mode] = useInputMode(null, "field")
        return field && mode == InputMode.Config && <>Setting <B>{field}</B></>
    },
}
