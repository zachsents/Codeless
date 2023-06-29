import { Columns, ListSearch, Search } from "tabler-icons-react"
import InferControl from "../../components/InferControl"
import { SheetInput } from "./shared/inputs"
import { SheetsIcon } from "./shared/misc"
import { useInputMode, useInputValue } from "../../hooks/nodes"
import ErrorText from "../../components/ErrorText"
import NodeBodyTable from "../../components/NodeBodyTable"


export default {
    id: "googlesheets:FindRowsByValue",
    name: "Find Rows by Exact Value",
    description: "Finds rows in a Google Sheet by searching for a value in a column.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets", "Tables", "Database"],

    inputs: [
        SheetInput,
        {
            id: "$column",
            name: "Column Name",
            description: "The column to look in.",
            tooltip: "The column to look in.",
            icon: Columns,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
        {
            id: "$value",
            description: "The value to compare against.",
            tooltip: "The value to compare against.",
            icon: Search,
            allowedModes: ["handle", "config"],
            renderConfiguration: InferControl,
        },
    ],

    outputs: [
        {
            id: "rows",
            description: "The rows that match the search.",
            tooltip: "The rows that match the search.",
            icon: ListSearch,
        },
    ],

    renderContent: () => {
        const [column] = useInputValue(null, "$column")

        const [value] = useInputValue(null, "$value")
        const [valueMode] = useInputMode(null, "$value")

        if (!column) return <ErrorText>No Column Provided</ErrorText>

        return <NodeBodyTable items={[
            ["Column", column],
            ...(valueMode === "config" ? [["Value", value]] : []),
        ]} />
    },
}
