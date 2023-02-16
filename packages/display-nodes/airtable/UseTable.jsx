import { useEffect, useState } from "react"
import { Center, Loader, Text, TextInput } from "@mantine/core"
import { BrandAirtable } from "tabler-icons-react"
import { getTableNameFromId } from "@minus/client-sdk/integrations/airtable"

import { Control, ControlLabel, ControlStack } from "../components"


const color = "yellow"
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

    renderNode: ({ state, setState, appId }) => {

        const [loading, setLoading] = useState(false)

        useEffect(() => {
            if (state.tableId && state.baseId && !loading) {
                setLoading(true)
                getTableNameFromId({ appId, baseId: state.baseId, tableId: state.tableId })
                    .then(res => setState({ tableName: res.data }))
                    .catch(err => console.error(err))
                    .finally(() => setLoading(false))
            }
        }, [state.tableId, state.baseId])

        return (
            <Center>
                {state.baseId && state.tableId ?
                    loading ?
                        <Loader size="xs" color={color} />
                        :
                        <>
                            <Text color="dimmed" component="span" size="xs">Using table&nbsp;</Text>
                            <Text component="span" weight={500} size="xs">"{state.tableName ?? "..."}"</Text>
                        </>
                    :
                    <Text color="dimmed" size="xs">Click to configure</Text>
                }
            </Center>
        )
    },

    configuration: ({ state, setState }) => {

        useEffect(() => {
            const [, baseId, tableId] = state.airtableUrl?.match(AirtableURLRegex) ?? []
            baseId && tableId && setState({ baseId, tableId })
        }, [state.airtableUrl])

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
                </Control>
            </ControlStack>
        )
    },

}