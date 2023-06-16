import { SheetNameControl, SpreadsheetURLControl } from "./controls"
import { Center, Image, Text } from "@mantine/core"
import { FileSpreadsheet, Link, List, Table } from "tabler-icons-react"


export const SpreadsheetURLInput = {
    id: "$spreadsheetUrl",
    name: "Spreadsheet URL",
    type: "url",
    description: "The URL of the spreadsheet you want to get data from.",
    tooltip: <>
        <Text>The URL while editing a Google Sheet.</Text>
        <Text color="dimmed">
            Example:<br />
            <Text span color="yellow" weight={500} sx={{ wordBreak: "break-all" }}>
                https://docs.google.com/spreadsheets/d/141NUUnvN8IYJgI9jLz_6SMn9b46hXhBRyVRvTMgKiHs/edit
            </Text>
        </Text>
    </>,
    icon: Link,
    allowedModes: ["handle", "config"],
    defaultMode: "config",
    renderConfiguration: SpreadsheetURLControl,
}


export const SheetNameInput = {
    id: "$sheetName",
    name: "Worksheet",
    type: "text",
    description: "The name of the sheet you want to get data from.",
    tooltip: <>
        <Text>The sheet you want to use.</Text>
        <Text color="dimmed">Example: "Sheet1" or "Customers"</Text>
        <Center px="xl" py="sm">
            <Image radius="md" src="/sheet-name-example.webp" alt="Sheet Name Example" maw={250} />
        </Center>
    </>
    ,
    icon: FileSpreadsheet,
    allowedModes: ["handle", "config"],
    defaultMode: "config",
    renderConfiguration: SheetNameControl,
}


export const SheetInput = {
    id: "$sheet",
    description: "The Google Sheet. Use the Load Sheet node to load a sheet.",
    tooltip: "The Google Sheet. Use the Load Sheet node to load a sheet.",
    icon: Table,
}


export const RowsInput = (description, tooltip) => ({
    id: "rows",
    description,
    tooltip: tooltip ?? description,
    icon: List,
})