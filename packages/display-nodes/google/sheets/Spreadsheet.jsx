import { Center, Stack, Text } from "@mantine/core"
import { SiGooglesheets } from "react-icons/si"
import { ControlStack } from "../../components"
import { SheetNameControl, SpreadsheetIDControl } from "./shared"


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

    defaultState: {
        spreadsheetId: null,
        sheetName: "",
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
                    <Text color="dimmed" size="xs">Missing parameters</Text>
                }
            </Center>
        )
    },

    configuration: props => {
        return (
            <ControlStack>
                <SpreadsheetIDControl {...props} />
                <SheetNameControl {...props} />
            </ControlStack>
        )
    }
}