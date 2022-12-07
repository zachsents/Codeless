import { Group, SegmentedControl, Stack, Text, Tooltip } from "@mantine/core"
import { BookDownload, InfoCircle } from "tabler-icons-react"
import { SiGooglesheets } from "react-icons/si"


const Dimension = {
    Rows: "ROWS",
    Columns: "COLUMNS",
}

export default {
    name: "Get Values",
    description: "Gets values from a Sheet.",
    icon: SiGooglesheets,
    color: "green",
    valueTargets: ["spreadsheetId", "range"],
    valueSources: [" "],

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