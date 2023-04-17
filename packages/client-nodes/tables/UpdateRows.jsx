import { ClipboardData, LayoutList, TableShortcut } from "tabler-icons-react"
import TextControl from "../components/TextControl"


export default {
    id: "tables:UpdateRows",
    name: "Update Rows",
    description: "Updates rows in a table.",
    icon: TableShortcut,
    color: "yellow",

    tags: ["Tables"],

    inputs: [
        {
            id: "rows",
            description: "The row(s) to update.",
            tooltip: "The row(s) to update.",
            icon: LayoutList,
        },
        {
            id: "data",
            description: "The data to update the row with.",
            tooltip: "The data to update the row with.",
            icon: ClipboardData,
            listMode: "named",
            defaultList: 1,
            listNamePlaceholder: "Column Name",
            allowedModes: ["handle", "config"],
            renderConfiguration: props => <TextControl {...props} inputProps={{
                placeholder: "Data",
            }} />,
        },
    ],
    outputs: [
        {
            id: "updatedRows",
            description: "The updated rows.",
            tooltip: "The updated rows.",
            icon: LayoutList,
            defaultShowing: false,
        },
    ],
}
