import { Group, SegmentedControl, Text, Tooltip } from "@mantine/core"
import { InfoCircle } from "tabler-icons-react"


export const Dimension = {
    Rows: "ROWS",
    Columns: "COLUMNS",
}


export function MajorDimensionControl({ state, setState }) {
    return (
        <>
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
        </>
    )
}