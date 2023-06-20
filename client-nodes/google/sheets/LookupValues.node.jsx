import { ClipboardData, Columns, ListSearch, TableOptions } from "tabler-icons-react"
import InferControl from "../../components/InferControl"
import { SheetsIcon } from "./shared/misc"


export default {
    id: "googlesheets:LookupValues",
    name: "Lookup Values",
    description: "Looks up values in another Google Sheet and returns the rows that match.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets", "Tables", "Database"],

    inputs: [
        {
            id: "$lookupSheet",
            name: "Lookup Sheet",
            description: "The Google Sheet containing the table to look up values in.",
            tooltip: "The Google Sheet containing the table to look up values in.",
            icon: TableOptions,
        },
        {
            id: "$keyColumn",
            name: "Lookup Column",
            description: "The column to look in.",
            tooltip: "The column to look in.",
            icon: Columns,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
        {
            id: "values",
            description: "The values to search for in the lookup table.",
            tooltip: "The values to search for in the lookup table.",
            icon: ClipboardData,
            allowedModes: ["handle", "config"],
            renderConfiguration: InferControl,
        },
    ],

    outputs: [
        {
            id: "rows",
            description: "The rows that correspond to the input values.",
            tooltip: "The rows that correspond to the input values.",
            icon: ListSearch,
        },
    ],

    // renderContent: () => {
    //     const [column] = useInputValue(null, "$column")

    //     const [value] = useInputValue(null, "$value")
    //     const [valueMode] = useInputMode(null, "$value")

    //     if (!column) return <ErrorText>No Column Provided</ErrorText>

    //     return <NodeBodyTable items={[
    //         ["Column", column],
    //         ...(valueMode === "config" ? [["Value", value]] : []),
    //     ]} />
    // },
}
