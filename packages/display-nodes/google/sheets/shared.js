import { Group, SegmentedControl, Text, TextInput, Tooltip } from "@mantine/core"
import { InfoCircle } from "tabler-icons-react"
import { Control, ControlLabel } from "../../components"


export const Dimension = {
    Rows: "ROWS",
    Columns: "COLUMNS",
}


export function MajorDimensionControl({ state, setState }) {
    return (
        <Control>
            <ControlLabel info="Whether values are grouped by row or column.">
                Major Dimension
            </ControlLabel>
            <SegmentedControl
                value={state.majorDimension ?? Dimension.Rows}
                onChange={val => setState({ majorDimension: val })}
                data={Object.keys(Dimension).map(key => ({ label: key, value: Dimension[key] }))}
            />
        </Control>
    )
}

export function SpreadsheetIDControl({ state, setState }) {
    return (
        <Control>
            <ControlLabel
                bold
                info={<>
                    <Text>You can find this in the URL while editing in Google Sheets.</Text>
                    <Text color="dimmed">
                        Example:<br />
                        https://docs.google.com/spreadsheets/d/<Text component="span" color="yellow" weight={500}>141NUUnvN8IYJgI9jLz_6SMn9b46hXhBRyVRvTMgKiHs</Text>/edit
                    </Text>
                </>}
            >
                Spreadsheet ID
            </ControlLabel>
            <TextInput
                value={state.spreadsheetId ?? ""}
                onChange={event => setState({ spreadsheetId: event.currentTarget.value })}
            />
        </Control>
    )
}

export function SheetNameControl({ state, setState }) {
    return (
        <Control>
            <ControlLabel info="The name of the sheet you want to use. Leave blank to use the first sheet.">
                Sheet Name
            </ControlLabel>
            <TextInput
                value={state.sheetName ?? ""}
                onChange={event => setState({ sheetName: event.currentTarget.value })}
            />
        </Control>
    )
}