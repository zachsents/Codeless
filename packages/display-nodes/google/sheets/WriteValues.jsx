import { Stack } from "@mantine/core"
import { SiGooglesheets } from "react-icons/si"
import { Dimension, MajorDimensionControl } from "./shared"


export default {
    name: "Set Values",
    description: "Sets values in a Sheet.",
    icon: SiGooglesheets,
    color: "green",
    valueTargets: [
        { name: "spreadsheetId", label: "Spreadsheet ID" },
        "range",
        "values",
    ],
    signalTargets: [" "],

    defaultState: { majorDimension: Dimension.Rows },

    configuration: ({ state, setState }) => {

        return (
            <Stack spacing={5} w={180}>
                <MajorDimensionControl state={state} setState={setState} />
            </Stack>
        )
    }
}