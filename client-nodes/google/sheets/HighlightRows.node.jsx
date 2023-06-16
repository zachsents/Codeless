import { BorderOuter, Paint } from "tabler-icons-react"
import ColorControl from "../../components/ColorControl"
import SlideOptionsControl from "../../components/SlideOptionsControl"
import { useInputValue } from "../../hooks/nodes"
import { RowsInput } from "./shared/inputs"
import { SheetsIcon } from "./shared/misc"


export default {
    id: "googlesheets:HighlightRows",
    name: "Highlight Row(s)",
    description: "Highlights rows in a Google Sheet.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets", "Tables", "Database"],

    inputs: [
        RowsInput("The rows to highlight."),
        {
            id: "$color",
            description: "The color to highlight the rows with.",
            tooltip: "The color to highlight the rows with.",
            icon: Paint,
            allowedModes: ["config"],
            defaultMode: "config",
            renderConfiguration: props => {

                const [mode] = useInputValue(null, "$mode")

                return <ColorControl
                    dark={mode == "border"}
                    {...props}
                />
            }
        },
        {
            id: "$mode",
            description: "The highlight mode.",
            tooltip: "The highlight mode.",
            icon: BorderOuter,
            allowedModes: ["config"],
            defaultMode: "config",
            defaultValue: "background",
            renderConfiguration: props => <SlideOptionsControl data={[
                { value: "background", label: "Background" },
                { value: "border", label: "Border" },
            ]} {...props} />
        },
    ],
}
