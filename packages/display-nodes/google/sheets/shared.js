import { SegmentedControl, Text, TextInput, Image, Center } from "@mantine/core"
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
                Google Sheet ID
            </ControlLabel>
            <TextInput
                name="spreadsheetId"
                value={state.spreadsheetId ?? ""}
                onChange={event => setState({ spreadsheetId: event.currentTarget.value })}
                error={state.spreadsheetId === null || /^[0-9A-Za-z_\-]{40,}$/.test(state.spreadsheetId) ? null : "This doesn't look like a valid Google Sheet ID"}
            />
        </Control>
    )
}

export function SheetNameControl({ state, setState }) {
    return (
        <Control>
            <ControlLabel info={<>
                <Text>The name of the sheet you want to use. Leave blank to use the first sheet.</Text>
                <Text color="dimmed">Example: "Sheet1" or "Customers" (don't include quotation marks)</Text>
                <Center px="xl" py="sm">
                    <Image radius="md" src="/sheet-name-example.webp" alt="Sheet Name Example" maw={250} />
                </Center>
            </>}>
                Sheet (Tab) Name
            </ControlLabel>
            <TextInput
                name="sheetName"
                value={state.sheetName ?? ""}
                onChange={event => setState({ sheetName: event.currentTarget.value })}
            />
        </Control>
    )
}