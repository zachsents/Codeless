import { SquareOff } from "tabler-icons-react"


export default {
    name: "Clear Values",
    description: "Clears values from a Sheet.",
    icon: SquareOff,
    color: "green",
    valueTargets: [
        { name: "spreadsheetId", label: "Spreadsheet ID" }, 
        "range",
    ],
    signalTargets: [" "],
}