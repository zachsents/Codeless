import { FileSpreadsheet, TriangleSquareCircle } from "tabler-icons-react"
import SlideOptionsControl from "../../components/SlideOptionsControl"
import { SheetInput } from "./shared/inputs"
import { SheetsIcon } from "./shared/misc"


/**
 * Disabled PDF for now, throws an error. It's probably either a billing or scope thing,
 * as I think it's part of the Drive API, not Sheets.
 */

export default {
    id: "googlesheets:ExportSheet",
    name: "Export Sheet",
    // description: "Exports a Google Sheet as a CSV, TSV, or PDF.",
    description: "Exports a Google Sheet as a CSV or TSV.",
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
                // { value: "xlsx", label: "Excel" },
                // { value: "pdf", label: "PDF" },
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
