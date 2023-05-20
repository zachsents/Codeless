import { useEffect } from "react"
import { BoxAlignTopLeft, FileSpreadsheet, Link, Numbers } from "tabler-icons-react"
import B from "../../components/B"
import TextControl from "../../components/TextControl"
import { useInputValue, useInternalState } from "../../hooks/nodes"
import { SheetNameControl, SheetNameTooltip, SheetsIcon, SpreadsheetURLControl, SpreadsheetURLTooltip, useGoogleSheetNode } from "./shared"


/** 
 * @type {import("../../DefaultTemplate.jsx").NodeTypeDefinition} 
 */
export default {
    id: "googlesheets:Range",
    name: "Get Range",
    description: "Gets a range of values from a Google Sheet.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets"],

    inputs: [
        {
            id: "$spreadsheetUrl",
            name: "Spreadsheet URL",
            description: "The URL of the spreadsheet you want to get data from.",
            tooltip: SpreadsheetURLTooltip,
            icon: Link,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            renderConfiguration: SpreadsheetURLControl,
        },
        {
            id: "$sheetName",
            name: "Sheet Name",
            description: "The name of the sheet you want to get data from.",
            tooltip: SheetNameTooltip,
            icon: FileSpreadsheet,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            renderConfiguration: SheetNameControl,
        },
        {
            id: "$range",
            description: "The range of cells you want to get data from.",
            tooltip: "The range of cells you want to get data from.",
            icon: BoxAlignTopLeft,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            renderConfiguration: props => <TextControl {...props} inputProps={{
                placeholder: "A1:B2",
            }} />,
        },
    ],
    outputs: [
        {
            id: "values",
            description: "The values in the range.",
            tooltip: "The values in the range.",
            icon: Numbers,
        },
    ],

    requiredIntegrations: ["integration:GoogleSheets"],

    useNodePresent: props => {
        useGoogleSheetNode(props)

        // capitalize range
        const [range, setRange] = useInputValue(null, "$range")
        useEffect(() => {
            range && setRange(range.toUpperCase())
        }, [range])
    },

    renderTextContent: () => {
        const [state] = useInternalState()
        const [sheetName] = useInputValue(null, "$sheetName")
        const [range] = useInputValue(null, "range")

        if (!state.spreadsheetName) return "No Spreadsheet Provided"
        if (!sheetName) return "No Sheet Selected"
        if (!range) return "No Range Provided"

        return <>Get <B>{range}</B> from <B>{sheetName}</B> in <B>{state.spreadsheetName}</B></>
    },
}