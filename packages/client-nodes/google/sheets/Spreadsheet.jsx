import { Center, Text, TextInput, Image, Loader, Select } from "@mantine/core"
import { useEffect } from "react"
import { SiGooglesheets } from "react-icons/si"
import { Control, ControlLabel, ControlStack, RequiresConfiguration } from "../../components/index"
import { useSpreadsheetDetails } from "@minus/client-sdk/integrations/sheets"


const color = "green"
const SheetsURLRegex = /d\/([0-9A-Za-z_\-]{40,})\/edit/


export default {
    id: "googlesheets:Spreadsheet",
    name: "Use Google Sheet",
    description: "Gets a sheet from your Google Drive.",
    icon: SiGooglesheets,
    color,
    badge: "Google Sheets",

    inputs: [],
    outputs: [
        {
            name: "_sheetRef",
            label: "Sheet",
        }
    ],

    requiredIntegrations: ["integration:GoogleSheets"],

    defaultState: {
        spreadsheetUrl: null,
        spreadsheetId: null,
        sheetName: null,
    },

    renderNode: ({ state, setState, appId, integrationsSatisfied }) => {

        // fetch spreadsheet details
        const { details, isLoading, isError } = useSpreadsheetDetails(integrationsSatisfied && appId, state.spreadsheetId)

        // sync details into node state
        useEffect(() => {
            setState({
                spreadsheetName: details?.name,
                sheets: details?.sheets,
                sheetName: details && !details.sheets.includes(state.sheetName) ? null : state.sheetName,
                isLoading,
            })
        }, [details, isLoading])

        // extract Spreadsheet ID when Spreadsheet URL changes
        useEffect(() => {
            const [, spreadsheetId] = state.spreadsheetUrl?.match(SheetsURLRegex) ?? []
            setState({ spreadsheetId })
        }, [state.spreadsheetUrl])

        return (
            <RequiresConfiguration dependencies={[
                state.spreadsheetId,
                state.sheetName,
                integrationsSatisfied,
                !isError,
            ]}>
                <Center>
                    {isLoading ?
                        <Loader size="xs" color={color} />
                        :
                        <>
                            <Text color="dimmed" component="span" size="xs">Using&nbsp;</Text>
                            <Text component="span" weight={500} size="xs">{state.sheetName}&nbsp;</Text>
                            <Text color="dimmed" component="span" size="xs">from&nbsp;</Text>
                            <Text component="span" weight={500} size="xs">{state.spreadsheetName}</Text>
                        </>}
                </Center>
            </RequiresConfiguration>
        )
    },

    configuration: ({ state, setState }) => {

        return (
            <ControlStack>
                <Control>
                    <ControlLabel
                        bold
                        info={<>
                            <Text>This is the URL while editing a Google Sheet.</Text>
                            <Text color="dimmed">
                                Example:<br />
                                <Text component="span" color="yellow" weight={500}>https://docs.google.com/spreadsheets/d/141NUUnvN8IYJgI9jLz_6SMn9b46hXhBRyVRvTMgKiHs/edit</Text>
                            </Text>
                        </>}
                    >
                        Google Sheet URL
                    </ControlLabel>
                    <TextInput
                        name="spreadsheetUrl"
                        placeholder="Google Sheets URL"
                        value={state.spreadsheetUrl ?? ""}
                        onChange={event => setState({ spreadsheetUrl: event.currentTarget.value })}
                        error={state.spreadsheetUrl === null || SheetsURLRegex.test(state.spreadsheetUrl) ? null : "This doesn't look like a valid Google Sheets URL"}
                    />
                    {state.spreadsheetName &&
                        <Text color="dimmed" size="xs">Using "{state.spreadsheetName}"</Text>}
                </Control>

                <Control>
                    <ControlLabel info={<>
                        <Text>The sheet you want to use.</Text>
                        <Text color="dimmed">Example: "Sheet1" or "Customers"</Text>
                        <Center px="xl" py="sm">
                            <Image radius="md" src="/sheet-name-example.webp" alt="Sheet Name Example" maw={250} />
                        </Center>
                    </>}>
                        Sheet (Tab)
                    </ControlLabel>
                    <Select
                        name="sheetName"
                        placeholder={state.isLoading ? "Loading sheets..." : "Pick a sheet"}
                        value={state.sheetName}
                        onChange={sheetName => setState({ sheetName })}
                        data={state.sheets ?? []}
                        disabled={state.isLoading || !state.spreadsheetId}
                        rightSection={state.isLoading && <Loader size="xs" />}
                    />
                </Control>
            </ControlStack>
        )
    }
}