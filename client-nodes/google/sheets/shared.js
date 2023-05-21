import { Button, Center, Group, Image, Loader, Select, Text, TextInput } from "@mantine/core"
import { useSpreadsheetDetails } from "@minus/client-sdk/integrations/sheets"
import { useEffect } from "react"
import { SiGooglesheets } from "react-icons/si"
import { TbExternalLink } from "react-icons/tb"
import TextControl from "../../components/TextControl"
import { useSyncWithNodeState } from "../../hooks"
import { InputMode, useInputMode, useInputValue, useInternalState } from "../../hooks/nodes"


export const SheetsURLRegex = /d\/([0-9A-Za-z_-]{40,})\/edit/

export const SheetsIcon = ({ strokeWidth, ...props }) => <SiGooglesheets {...props} /> // block strokeWidth prop for this icon


export const SpreadsheetURLTooltip = <>
    <Text>The URL while editing a Google Sheet.</Text>
    <Text color="dimmed">
        Example:<br />
        <Text span color="yellow" weight={500} sx={{ wordBreak: "break-all" }}>
            https://docs.google.com/spreadsheets/d/141NUUnvN8IYJgI9jLz_6SMn9b46hXhBRyVRvTMgKiHs/edit
        </Text>
    </Text>
</>


export const SheetNameTooltip = <>
    <Text>The sheet you want to use.</Text>
    <Text color="dimmed">Example: "Sheet1" or "Customers"</Text>
    <Center px="xl" py="sm">
        <Image radius="md" src="/sheet-name-example.webp" alt="Sheet Name Example" maw={250} />
    </Center>
</>


export function SpreadsheetURLControl({ inputId }) {
    const [state] = useInternalState()
    const [value, setValue] = useInputValue(null, inputId)
    const isValid = value == null || SheetsURLRegex.test(value)

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
    const [urlMode] = useInputMode(null, "$spreadsheetUrl")

    return urlMode == InputMode.Config ? <Select
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


export function useGoogleSheetNode({ appId, integrationsSatisfied }) {

    const [state, setState] = useInternalState()
    const [spreadsheetUrl] = useInputValue(null, "$spreadsheetUrl")

    // extract Spreadsheet ID when Spreadsheet URL changes
    useEffect(() => {
        const [, spreadsheetId] = spreadsheetUrl?.match(SheetsURLRegex) ?? []
        setState({ spreadsheetId })
    }, [spreadsheetUrl])

    // fetch spreadsheet details
    const { data: details, isLoading } = useSpreadsheetDetails(integrationsSatisfied && appId, state.spreadsheetId)

    // sync details into node state
    useSyncWithNodeState({
        spreadsheetName: details?.name,
        sheets: details?.sheets,
        sheetName: details && !details.sheets.includes(state.sheetName) ? null : state.sheetName,
        isLoading,
    }, setState)
}


export function parseRange(text) {
    const [, sheet, start, end] = text?.match?.(/(?:'([^']*)'!)?([A-Za-z0-9]*)(?::([A-Za-z0-9]*))?/) ?? []
    return { sheet, start, end }
}