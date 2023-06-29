import { BoxAlignTop, Columns, LayoutList, Table } from "tabler-icons-react"
import ErrorText from "../../components/ErrorText"
import NodeBodyTable from "../../components/NodeBodyTable"
import NumberControl from "../../components/NumberControl"
import { useInputValue, useInternalState } from "../../hooks/nodes"
import { useSpreadsheetDetailsInNode, useSpreadsheetURL } from "./shared/hooks"
import { SheetNameInput, SpreadsheetURLInput } from "./shared/inputs"
import { SheetsIcon } from "./shared/misc"


/** 
 * @type {import("../../DefaultTemplate.jsx").NodeTypeDefinition} 
 */
export default {
    id: "googlesheets:LoadSheet",
    name: "Load Sheet",
    description: "Loads in a Google Sheet.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets", "Tables", "Database"],

    inputs: [
        SpreadsheetURLInput,
        SheetNameInput,
        {
            id: "$headerRow",
            type: "number",
            description: "The row of the table which contains the headers (column names) for the table. Headers are required for row operations.",
            tooltip: <>
                The row of the table which contains the headers (column names) for the table. <br /> <b>Headers are required for row operations.</b>
            </>,
            icon: BoxAlignTop,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            defaultValue: 1,
            renderConfiguration: props => <NumberControl {...props} inputProps={{
                placeholder: "1",
                min: 1,
            }} />,
        },
    ],
    outputs: [
        {
            id: "sheet",
            description: "The Google Sheet. Use other Google Sheets nodes to interact with it.",
            tooltip: "The Google Sheet. Use other Google Sheets nodes to interact with it.",
            icon: Table,
        },
        {
            id: "rowCount",
            description: "The number of rows in the sheet.",
            tooltip: "The number of rows in the sheet.",
            icon: LayoutList,
            defaultShowing: false,
        },
        {
            id: "columnCount",
            description: "The number of columns in the sheet.",
            tooltip: "The number of columns in the sheet.",
            icon: Columns,
            defaultShowing: false,
        },
    ],

    requiredIntegrations: ["google"],

    useNodePresent: props => {
        useSpreadsheetURL()
        useSpreadsheetDetailsInNode(props)
    },

    renderContent: () => {
        const [state] = useInternalState()
        const [sheetName] = useInputValue(null, "$sheetName")

        if (!state.spreadsheetName) return <ErrorText>No Spreadsheet Provided</ErrorText>
        if (!sheetName) return <ErrorText>No Worksheet Provided</ErrorText>

        return <NodeBodyTable items={[
            ["Spreadsheet", state.spreadsheetName],
            ["Worksheet", sheetName],
        ]} />
    },
}