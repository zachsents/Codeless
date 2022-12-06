import { Group, SegmentedControl, Stack, Text, Tooltip } from "@mantine/core"
import { BookDownload, InfoCircle } from "tabler-icons-react"

const Dimension = {
    Rows: "ROWS",
    Columns: "COLUMNS",
}

export default {
    name: "Get Values",
    description: "Gets values from a Sheet.",
    icon: BookDownload,
    color: "green.5",
    valueTargets: ["spreadsheetId", "range"],
    valueSources: [" "],

    defaultState: { majorDimension: Dimension.Rows },

    expanded: ({ state, setState }) => {

        return (
            <Stack mt={5} spacing={3} w={150}>
                <Group position="apart">
                    <Text size="xs">Major Dimension</Text>
                    <Tooltip label={<Text size="xs">Whether values are grouped by row or column.</Text>}>
                        <Text color="dimmed" size="xs" mb={-4}><InfoCircle size="12" /></Text>
                    </Tooltip>
                </Group>
                <SegmentedControl
                    value={state.majorDimension ?? Dimension.Rows}
                    onChange={val => setState({ majorDimension: val })}
                    size="xs"
                    data={Object.keys(Dimension).map(key => ({ label: key, value: Dimension[key] }))}
                />
            </Stack>
        )
    }
}