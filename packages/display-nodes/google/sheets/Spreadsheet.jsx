import { Center, Text, TextInput, Image } from "@mantine/core"
import { SiGooglesheets } from "react-icons/si"
import { Control, ControlLabel, ControlStack } from "../../components"


export default {
    id: "googlesheets:Spreadsheet",
    name: "Use Google Sheet",
    description: "Gets a sheet from your Google Drive.",
    icon: SiGooglesheets,
    color: "green",
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
        spreadsheetId: null,
        sheetName: null,
    },

    renderNode: ({ state }) => {
        return (
            <Center>
                {state.sheetName && state.spreadsheetId ?
                    <>
                        <Text color="dimmed" component="span" size="xs">Using sheet&nbsp;</Text>
                        <Text component="span" weight={500} size="xs">"{state.sheetName}"</Text>
                    </>
                    :
                    <Text color="dimmed" size="xs">Click to configure</Text>
                }
            </Center>
        )
    },

    configuration: ({ state, setState }) => {
        return (
            <ControlStack>
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
                        placeholder="ID from Google Sheets URL"
                        value={state.spreadsheetId}
                        onChange={event => setState({ spreadsheetId: event.currentTarget.value })}
                        error={state.spreadsheetId === null || /^[0-9A-Za-z_\-]{40,}$/.test(state.spreadsheetId) ? null : "This doesn't look like a valid Google Sheet ID"}
                    />
                </Control>

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
                        placeholder="Sheet1, Customers, etc."
                        value={state.sheetName}
                        onChange={event => setState({ sheetName: event.currentTarget.value })}
                    />
                </Control>
            </ControlStack>
        )
    }
}