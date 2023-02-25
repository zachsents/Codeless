import { useEffect } from "react"
import { Center, Loader, Text, TextInput } from "@mantine/core"
import { BrandAirtable } from "tabler-icons-react"
import { useTableNameFromId } from "@minus/client-sdk/integrations/airtable"

import { Control, ControlLabel, ControlStack, RequiresConfiguration } from "../components/index"


const color = "blue"
const AirtableURLRegex = /(app[0-9A-Za-z]{12,16})\/(tbl[0-9A-Za-z]{12,16})/


export default {
    id: "airtable:UseTable",
    name: "Use Table",
    description: "Configures a base and table from AirTable.",
    icon: BrandAirtable,
    color,
    badge: "airtable",

    inputs: [],
    outputs: ["table"],

    requiredIntegrations: ["integration:AirTable"],

    defaultState: {
        airtableUrl: null,
        baseId: null,
        tableId: null,
    },

    renderNode: ({ state, setState, appId, integrationsSatisfied }) => {

        // fetch table name
        const { tableName, isLoading, isError } = useTableNameFromId(integrationsSatisfied && appId, state.baseId, state.tableId)

        // sync table name with node state
        useEffect(() => {
            setState({ tableName })
        }, [tableName])

        // extract base ID and table ID when Airtable URL changes
        useEffect(() => {
            const [, baseId, tableId] = state.airtableUrl?.match(AirtableURLRegex) ?? []
            setState({ baseId, tableId })
        }, [state.airtableUrl])

        return (
            <RequiresConfiguration dependencies={[
                state.baseId,
                state.tableId,
                integrationsSatisfied,
                !isError,
            ]}>
                <Center>
                    {isLoading ?
                        <Loader size="xs" color={color} />
                        :
                        <>
                            <Text color="dimmed" component="span" size="xs">Using table&nbsp;</Text>
                            <Text component="span" weight={500} size="xs">"{tableName ?? "..."}"</Text>
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
                            <Text>The URL when you're editing a table in Airtable.</Text>
                            <Text color="dimmed">
                                Example:<br />
                                <Text component="span" color="yellow" weight={500}>https://airtable.com/app7QmV6qHgNBOPwc/tblSNoMchfTglHOd0/viwxBMD91zjrZrWK4</Text>
                            </Text>
                        </>}
                    >
                        Airtable URL
                    </ControlLabel>
                    <TextInput
                        name="airtableUrl"
                        value={state.airtableUrl ?? ""}
                        placeholder="https://airtable.com/..."
                        onChange={event => setState({ airtableUrl: event.currentTarget.value })}
                        error={state.airtableUrl === null || AirtableURLRegex.test(state.airtableUrl) ? null : "This doesn't look like a valid Airtable URL"}
                    />
                    {state.tableName &&
                        <Text color="dimmed" size="xs">Using "{state.tableName}"</Text>}
                </Control>
            </ControlStack>
        )
    },

}