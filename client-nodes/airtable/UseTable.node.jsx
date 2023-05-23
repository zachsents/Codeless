import { Loader, Text, TextInput } from "@mantine/core"
import { useTableNameFromId } from "@minus/client-sdk/integrations/airtable"
import { useMemo } from "react"
import { BrandAirtable } from "tabler-icons-react"

import { Link } from "tabler-icons-react"
import RequiresConfiguration from "../components/RequiresConfiguration"
import { useSyncWithNodeState } from "../hooks"
import { useInputValue, useInternalState } from "../hooks/nodes"


const color = "blue"
const AirtableURLRegex = /(app[0-9A-Za-z]{12,16})\/(tbl[0-9A-Za-z]{12,16})/


/** 
 * @type {import("../DefaultTemplate.jsx").NodeTypeDefinition} 
 */
export default {
    id: "airtable:UseTable",
    name: "Load Table",
    description: "Configures a base and table from AirTable.",

    icon: BrandAirtable,
    color,

    tags: ["Airtable", "Tables", "Database"],

    requiredIntegrations: ["airtable"],

    inputs: [
        {
            id: "$airtableUrl",
            name: "Airtable URL",
            description: "The URL when you're editing a table in Airtable.",
            allowedModes: ["config"],
            defaultMode: "config",
            icon: Link,
            tooltip: <>
                <Text>The URL when you're editing a table in Airtable.</Text>
                <Text color="dimmed">
                    Example:<br />
                    <Text span color="yellow" weight={500}>https://airtable.com/app7QmV6qHgNBOPwc/tblSNoMchfTglHOd0/viwxBMD91zjrZrWK4</Text>
                </Text>
            </>,
            renderConfiguration: ({ inputId }) => {

                const [state] = useInternalState()
                const [value, setValue] = useInputValue(null, inputId)

                return <>
                    <TextInput
                        value={value ?? ""}
                        onChange={event => setValue(event.currentTarget.value)}
                        name="airtableUrl"
                        placeholder="https://airtable.com/..."
                        error={value === null || AirtableURLRegex.test(value) ?
                            null :
                            "This doesn't look like a valid Airtable URL"}
                    />
                    {state.tableName &&
                        <Text color="dimmed" size="xs">Using "{state.tableName}"</Text>}
                </>
            },
        }
    ],
    outputs: ["table"],

    defaultState: {
        baseId: null,
        tableId: null,
    },

    useNodePresent: ({ appId, integrationsSatisfied }) => {

        const [, setState] = useInternalState()
        const [airtableUrl] = useInputValue(null, "$airtableUrl")

        // extract base ID and table ID from Airtable URL
        const [, baseId, tableId] = useMemo(
            () => airtableUrl?.match(AirtableURLRegex) ?? [],
            [airtableUrl]
        )

        // fetch table name
        const { tableName, isLoading, isError } = useTableNameFromId(integrationsSatisfied && appId, baseId, tableId)

        // sync state with node state
        useSyncWithNodeState({ tableName, isLoading, isError, baseId, tableId }, setState)
    },

    renderTextContent: ({ integrationsSatisfied }) => {

        const [state] = useInternalState()

        return (
            // TO DO: make this look at the input mode and only require the base ID and table ID if it's in config mode
            <RequiresConfiguration includeCenter={false} span dependencies={[
                state.baseId,
                state.tableId,
                integrationsSatisfied,
                !state.isError,
            ]}>
                {state.isLoading ?
                    <Loader size="xs" color={color} />
                    :
                    <>
                        <Text span color="dimmed">Using table{" "}</Text>
                        <Text span weight={500}>"{state.tableName ?? "..."}"</Text>
                    </>}
            </RequiresConfiguration>
        )
    },
}