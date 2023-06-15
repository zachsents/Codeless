import { ColorFilter, Filter, ListSearch } from "tabler-icons-react"
import SlideOptionsControl from "../../components/SlideOptionsControl"
import { SheetInput } from "./shared/inputs"
import { SheetsIcon } from "./shared/misc"


export default {
    id: "googlesheets:FindRows",
    name: "Find Rows with Filter",
    description: "Finds rows in a Google Sheet.",
    icon: SheetsIcon,
    color: "green",

    tags: ["Google Sheets", "Tables", "Database"],

    inputs: [
        SheetInput,
        {
            id: "filters",
            description: "The filters to find the rows. Use the Filter (Google Sheets) node. If multiple filters are provided, they will be combined with AND.",
            tooltip: "The filters to find the rows. Use the Filter (Google Sheets) node. If multiple filters are provided, they will be combined with AND.",
            icon: Filter,
        },
        {
            id: "$filterBehavior",
            description: "How to combine the filters. \"Match All\" will only return rows that match all filters. \"Match Any\" will return rows that match any filter.",
            tooltip: "How to combine the filters. \"Match All\" will only return rows that match all filters. \"Match Any\" will return rows that match any filter.",
            icon: ColorFilter,
            allowedModes: ["config"],
            defaultMode: "config",
            defaultValue: "and",
            renderConfiguration: props => <SlideOptionsControl data={[
                { value: "and", label: "Match All" },
                { value: "or", label: "Match Any" },
            ]} {...props} />
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
}
