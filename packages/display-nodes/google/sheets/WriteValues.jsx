import { Group, SegmentedControl, Stack, Text, Tooltip } from "@mantine/core"
import { BookUpload, InfoCircle } from "tabler-icons-react"
import { SiGooglesheets } from "react-icons/si"

const Dimension = {
    Rows: "ROWS",
    Columns: "COLUMNS",
}

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
                <Group position="apart">
                    <Text size="sm">Major Dimension</Text>
                    <Tooltip label="Whether values are grouped by row or column.">
                        <Text color="dimmed" size="sm" mb={-5}><InfoCircle size={15} /></Text>
                    </Tooltip>
                </Group>
                <SegmentedControl
                    value={state.majorDimension ?? Dimension.Rows}
                    onChange={val => setState({ majorDimension: val })}
                    data={Object.keys(Dimension).map(key => ({ label: key, value: Dimension[key] }))}
                />
            </Stack>
        )
    }
}