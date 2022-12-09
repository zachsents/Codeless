import { Stack } from "@mantine/core"
import { SiGooglesheets } from "react-icons/si"
import { Dimension, MajorDimensionControl } from "./shared"


export default {
    name: "Get Sheet",
    description: "Gets the data from an entire Sheet.",
    icon: SiGooglesheets,
    color: "green",
    valueTargets: [
        { name: "spreadsheetId", label: "Spreadsheet ID" },
        "sheetName",
    ],
    valueSources: [" "],

    defaultState: { majorDimension: Dimension.Rows },

    configuration: ({ state, setState }) => {

        return (
            <Stack spacing={5} w={180}>
                <MajorDimensionControl state={state} setState={setState} />
            </Stack>
        )
    }
}