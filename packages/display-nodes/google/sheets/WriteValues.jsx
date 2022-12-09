import { Stack } from "@mantine/core"
import { BoxAlignTopLeft } from "tabler-icons-react"
import { SiGooglesheets } from "react-icons/si"
import { Dimension, MajorDimensionControl } from "./shared"


export default {
    name: "Set Range",
    description: "Sets values in a range in a Google Sheet.",
    icon: BoxAlignTopLeft,
    color: "green",
    valueTargets: [
        { name: "spreadsheetId", label: "Spreadsheet ID" },
        "range",
        "values",
    ],
    signalTargets: [" "],
    signalSources: ["  "],

    defaultState: { majorDimension: Dimension.Rows },

    configuration: ({ state, setState }) => {

        return (
            <Stack spacing={5} w={180}>
                <MajorDimensionControl state={state} setState={setState} />
            </Stack>
        )
    }
}