import { Checkbox, Stack, Text } from "@mantine/core"
import { BoxAlignTop, BoxAlignTopLeft, ClipboardData, FileSpreadsheet, Link, Table } from "tabler-icons-react"
import NodeBodyTable from "../../components/NodeBodyTable"
import NumberControl from "../../components/NumberControl"
import TextControl from "../../components/TextControl"
import { useInputValue, useInternalState } from "../../hooks/nodes"
import { SheetNameControl, SheetNameTooltip, SheetsIcon, SpreadsheetURLControl, SpreadsheetURLTooltip, useGoogleSheetNode } from "./shared"


/** 
 * @type {import("../../DefaultTemplate.jsx").NodeTypeDefinition} 
 */
export default {
    id: "googlesheets:Table",
    name: "Load Table",
    description: "Uses a Google Sheet as a table.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets", "Tables", "Database"],

    inputs: [
        {
            id: "$spreadsheetUrl",
            name: "Spreadsheet URL",
            type: "url",
            description: "The URL of the spreadsheet you want to get data from.",
            tooltip: SpreadsheetURLTooltip,
            icon: Link,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            renderConfiguration: SpreadsheetURLControl,
        },
        {
            id: "$sheetName",
            name: "Worksheet",
            type: "text",
            description: "The name of the sheet you want to get data from.",
            tooltip: SheetNameTooltip,
            icon: FileSpreadsheet,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            renderConfiguration: SheetNameControl,
        },
        {
            id: "$range",
            type: "text",
            description: "The range of the table you want to read. To use the entire sheet, select the 'Use Entire Sheet' option.",
            tooltip: "The range of the table you want to read. To use the entire sheet, select the 'Use Entire Sheet' option.",
            icon: BoxAlignTopLeft,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            renderConfiguration: props => {

                const [state, setState] = useInternalState()

                return <Stack spacing="xs">
                    <Checkbox
                        label="Use Entire Sheet"
                        checked={state.useEntireSheet ?? false}
                        onChange={event => setState({ useEntireSheet: event.currentTarget.checked })}
                    />
                    <TextControl {...props} inputProps={{
                        placeholder: "A1:B2",
                        disabled: state.useEntireSheet,
                    }} />
                </Stack>
            },
        },
        {
            id: "$headerRow",
            type: "number",
            description: "The row of the table which contains the headers (column names) for the table. Headers are required.",
            tooltip: <>
                The row of the table which contains the headers (column names) for the table. <br /> <b>Headers are required.</b>
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
        {
            id: "$dataStartRow",
            type: "number",
            description: "The row of the table which contains the first row of data. If the data starts directly after the header row, set this to the header row + 1.",
            tooltip: <>
                The row of the table which contains the first row of data.<br />
                <Text color="dimmed">If the data starts directly after the header row, set this to the header row + 1.</Text>
            </>,
            icon: ClipboardData,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            defaultValue: 2,
            renderConfiguration: props => {
                const [headerRow] = useInputValue(null, "$headerRow")
                return <NumberControl {...props} inputProps={{
                    placeholder: "1",
                    min: (headerRow ?? 1) + 1,
                }} />
            },
        },
    ],
    outputs: [
        {
            id: "table",
            type: "table",
            description: "The table. Use the yellow 'Tables' nodes to create, read, update, and delete rows.",
            tooltip: "The table. Use the yellow 'Tables' nodes to create, read, update, and delete rows.",
            icon: Table,
        },
    ],

    requiredIntegrations: ["integration:GoogleSheets"],

    defaultState: {
        useEntireSheet: true,
    },

    useNodePresent: useGoogleSheetNode,

    renderContent: () => {
        const [state] = useInternalState()
        const [sheetName] = useInputValue(null, "$sheetName")
        const [range] = useInputValue(null, "$range")

        if (!state.spreadsheetName) return <Text>No Spreadsheet Provided</Text>
        if (!sheetName) return <Text>No Worksheet Provided</Text>
        if (!state.useEntireSheet && !range) return <Text>No Range Provided</Text>

        const tableItems = [
            ["Spreadsheet", state.spreadsheetName],
            ["Worksheet", sheetName],
        ]
        !state.useEntireSheet && tableItems.push(["Range", range])

        return <NodeBodyTable items={tableItems} />
    },
}