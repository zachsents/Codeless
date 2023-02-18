import { Center, Text, TextInput, Image, Loader, Select } from "@mantine/core"
import { useEffect } from "react"
import { SiGooglesheets } from "react-icons/si"
import { Control, ControlLabel, ControlStack } from "../../components"
import { getSpreadsheetDetails } from "@minus/client-sdk/integrations/sheets"


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
            suggested: [
                "googlesheets:Table",
                "googlesheets:Range",
            ],
        }
    ],

    requiredIntegrations: ["integration:GoogleSheets"],

    defaultState: {
        spreadsheetUrl: null,
        spreadsheetId: null,
        sheetName: null,
    },

    renderNode: ({ state, setState, appId }) => {

        useEffect(() => {
            if (state.spreadsheetId && !state.loading) {
                setState({ loading: true })
                getSpreadsheetDetails({ appId, spreadsheetId: state.spreadsheetId })
                    .then(res => setState({
                        spreadsheetName: res.data.name,
                        sheets: res.data.sheets,
                        sheetName: res.data.sheets.includes(state.sheetName) ? state.sheetName : null,
                    }))
                    .catch(err => console.error(err))
                    .finally(() => setState({ loading: false }))
                return
            }
            setState({ loading: false })
        }, [state.spreadsheetId])

        return (
            <Center>
                {state.sheetName && state.spreadsheetId ?
                    state.loading ?
                        <Loader size="xs" color={color} />
                        :
                        <>
                            <Text color="dimmed" component="span" size="xs">Using&nbsp;</Text>
                            <Text component="span" weight={500} size="xs">{state.sheetName}&nbsp;</Text>
                            <Text color="dimmed" component="span" size="xs">from&nbsp;</Text>
                            <Text component="span" weight={500} size="xs">{state.spreadsheetName}</Text>
                        </>
                    :
                    <Text color="dimmed" size="xs">Click to configure</Text>
                }
            </Center>
        )
    },

    configuration: ({ state, setState, appId }) => {

        useEffect(() => {
            const [, spreadsheetId] = state.spreadsheetUrl?.match(SheetsURLRegex) ?? []
            spreadsheetId && setState({ spreadsheetId })
        }, [state.spreadsheetUrl])

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
                        placeholder={state.loading ? "Loading sheets..." : "Pick a sheet"}
                        value={state.sheetName}
                        onChange={sheetName => setState({ sheetName })}
                        data={state.sheets ?? []}
                        disabled={state.loading}
                        rightSection={state.loading && <Loader size="xs" />}
                    />
                </Control>
            </ControlStack>
        )
    }
}