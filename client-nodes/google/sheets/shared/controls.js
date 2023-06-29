import { Button, Group, Loader, Select, Text, TextInput } from "@mantine/core"
import { TbExternalLink } from "react-icons/tb"
import { InputMode, useInputMode, useInputValue, useInternalState, } from "../../../hooks/nodes"
import TextControl from "../../../components/TextControl"
import { SpreadsheetURLInput } from "./inputs"
import { SHEETS_URL_REGEX } from "./misc"


export function SpreadsheetURLControl({ inputId }) {
    const [state] = useInternalState()
    const [value, setValue] = useInputValue(null, inputId)
    const isValid = value == null || SHEETS_URL_REGEX.test(value)

    const shouldLinkToSpreadsheet = isValid && value != null

    return <>
        <TextInput
            value={value ?? ""}
            onChange={event => setValue(event.currentTarget.value)}
            name="spreadsheetUrl"
            placeholder="https://docs.google.com/..."
            error={!isValid && "This doesn't look like a valid Google Sheets URL"}
            size="xs"
        />

        {state.spreadsheetName &&
            <Text color="dimmed" size="xs">Using "{state.spreadsheetName}"</Text>}

        <Group position="right">
            <Button
                component="a"
                // if it's not a valid URL, just link to the Google Sheets home page
                href={shouldLinkToSpreadsheet ? value : "https://docs.google.com/spreadsheets/u/0/"} target="_blank"
                color="green" size="xs" variant="subtle" rightIcon={<TbExternalLink />} compact
            >
                View Sheet{shouldLinkToSpreadsheet ? "" : "s"}
            </Button>
        </Group>
    </>
}


export function SheetNameControl({ inputId }) {
    const [state] = useInternalState()
    const [value, setValue] = useInputValue(null, inputId)
    const [urlMode] = useInputMode(null, SpreadsheetURLInput.id)

    return urlMode == InputMode.Config ?
        <Select
            name="sheetName"
            placeholder={state.isLoading ? "Loading sheets..." : "Pick a sheet"}
            value={value ?? null}
            onChange={setValue}
            data={state.sheets ?? []}
            disabled={state.isLoading || !state.spreadsheetId}
            rightSection={state.isLoading && <Loader size="xs" />}
            withinPortal
            size="xs"
        /> :
        <TextControl inputId={inputId} size="xs" />
}