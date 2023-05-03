import { Button, Group, Stack } from "@mantine/core"
import { List, ListSearch, Search, Table } from "tabler-icons-react"
import NumberControl from "../components/NumberControl"
import { useInputValue } from "../hooks/nodes"


export default {
    id: "tables:FindRows",
    name: "Query",
    description: "Searches a table for rows matching the configured filters.",
    icon: Table,
    color: "yellow",

    tags: ["Tables", "Advanced"],

    inputs: [
        {
            id: "$table",
            description: "The table to query.",
            tooltip: "The table to query.",
            icon: Table,
        },
        {
            id: "filters",
            description: "The filters to apply to the query.",
            tooltip: "The filters to apply to the query.",
            icon: Search,
        },
        {
            id: "$limit",
            description: "The number of rows to return. Leave blank to not set a limit.",
            tooltip: "The number of rows to return. Leave blank to not set a limit.",
            icon: List,
            allowedModes: ["config", "handle"],
            defaultMode: "config",
            renderConfiguration: props => {
                const [, setLimit] = useInputValue(null, props.inputId)

                return (
                    <Stack spacing={"xs"}>
                        <NumberControl {...props} inputProps={{
                            min: 1,
                        }} />
                        <Group position="center">
                            <Button size="xs" compact variant="subtle" onClick={() => setLimit(1)}>
                                Single Row
                            </Button>
                            <Button size="xs" compact variant="subtle" onClick={() => setLimit(undefined)}>
                                No Limit
                            </Button>
                        </Group>
                    </Stack>
                )
            },
        }
    ],
    outputs: [
        {
            id: "rows",
            description: "The rows that match the query.",
            tooltip: "The rows that match the query.",
            icon: ListSearch,
        },
    ],
}
