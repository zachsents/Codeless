import { useEffect } from "react"
import { BoxAlignTopLeft, Numbers } from "tabler-icons-react"
import B from "../../components/B"
import TextControl from "../../components/TextControl"
import { useInputValue, useInternalState } from "../../hooks/nodes"
import { useGoogleSheetNode } from "./shared/hooks"
import { SheetNameInput, SpreadsheetURLInput } from "./shared/inputs"
import { SheetsIcon } from "./shared/misc"


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
        SpreadsheetURLInput,
        SheetNameInput,
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

    requiredIntegrations: ["google"],

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