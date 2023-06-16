import { FileSpreadsheet, TriangleSquareCircle } from "tabler-icons-react"
import SlideOptionsControl from "../../components/SlideOptionsControl"
import { SheetInput } from "./shared/inputs"
import { SheetsIcon } from "./shared/misc"


export default {
    id: "googlesheets:ExportSheet",
    name: "Export Sheet",
    description: "Exports a Google Sheet as a CSV, TSV, or PDF.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets", "Tables", "Database"],

    inputs: [
        SheetInput,
        {
            id: "$format",
            description: "The format to export the sheet as.",
            tooltip: "The format to export the sheet as.",
            icon: TriangleSquareCircle,
            allowedModes: ["config"],
            defaultMode: "config",
            defaultValue: "csv",
            renderConfiguration: props => <SlideOptionsControl data={[
                { value: "csv", label: "CSV" },
                { value: "tsv", label: "TSV" },
                { value: "pdf", label: "PDF" },
            ]} {...props} />,
        },
    ],
    outputs: [
        {
            id: "file",
            description: "The file.",
            tooltip: "The file.",
            icon: FileSpreadsheet,
        },
    ],
}
