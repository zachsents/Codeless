import { Equal, Filter, Search, Table } from "tabler-icons-react"
import ErrorText from "../../components/ErrorText"
import NodeBodyTable from "../../components/NodeBodyTable"
import SelectControl from "../../components/SelectControl"
import { useInputMode, useInputValue } from "../../hooks/nodes"
import { SheetsIcon } from "./shared/misc"
import InferControl from "../../components/InferControl"


const OPERATORS = [
    { value: "equal", label: "Equals", group: "Any" },
    { value: "notEqual", label: "Does Not Equal", group: "Any" },
    { value: "gt", label: "Greater Than", group: "Numbers" },
    { value: "gte", label: "Greater Than or Equal To", group: "Numbers" },
    { value: "lt", label: "Less Than", group: "Numbers" },
    { value: "lte", label: "Less Than or Equal To", group: "Numbers" },
    { value: "equalIgnoreCase", label: "Equals (ignore case)", group: "Text" },
    { value: "contains", label: "Contains", group: "Text" },
    { value: "notcontains", label: "Does Not Contain", group: "Text" },
    { value: "startsWith", label: "Starts With", group: "Text" },
    { value: "endsWith", label: "Ends With", group: "Text" },
]


export default {
    id: "googlesheets:Filter",
    name: "Filter (Google Sheets)",
    description: "Creates a filter to use with the Find Rows with Filter node.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets", "Tables", "Database"],

    inputs: [
        {
            id: "$column",
            name: "Column Name",
            description: "The column to look in.",
            tooltip: "The column to look in.",
            icon: Table,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
        },
        {
            id: "$operator",
            description: "The operator to use.",
            tooltip: "The operator to use.",
            icon: Equal,
            allowedModes: ["config"],
            defaultMode: "config",
            defaultValue: "equal",
            renderConfiguration: props => <SelectControl
                data={OPERATORS}
                inputProps={{
                    placeholder: "Select an operator",
                }}
                {...props}
            />
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
            id: "filter",
            description: "The filter to use with the Find Rows with Filter node.",
            tooltip: "The filter to use with the Find Rows with Filter node.",
            icon: Filter,
        }
    ],

    renderContent: () => {
        const [column] = useInputValue(null, "$column")
        const [operator] = useInputValue(null, "$operator")

        const [value] = useInputValue(null, "$value")
        const [valueMode] = useInputMode(null, "$value")

        if (!column) return <ErrorText>No Column Provided</ErrorText>

        return <NodeBodyTable items={[
            ["Column", column],
            ["Operator", OPERATORS.find(op => op.value === operator)?.label || operator],
            ...(valueMode === "config" ? [["Value", value]] : []),
        ]} />
    },
}
