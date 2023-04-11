import { Loader, Text, TextInput } from "@mantine/core"
import { useTableNameFromId } from "@minus/client-sdk/integrations/airtable"
import { useMemo } from "react"
import { BrandAirtable } from "tabler-icons-react"

import { RequiresConfiguration } from "../components/index"
import { useSyncWithNodeState } from "../hooks"
import { Link } from "tabler-icons-react"


const color = "blue"
const AirtableURLRegex = /(app[0-9A-Za-z]{12,16})\/(tbl[0-9A-Za-z]{12,16})/


/** 
 * @type {import("../DefaultTemplate.jsx").NodeTypeDefinition} 
 */
export default {
    id: "airtable:UseTable",
    name: "Airtable",
    description: "Configures a base and table from AirTable.",

    icon: BrandAirtable,
    color,

    tags: ["Airtable", "Table", "Database"],
    showMainTag: false,

    inputs: [
        {
            id: "$airtableUrl",
            name: "Airtable URL",
            description: "The URL when you're editing a table in Airtable.",
            required: true,
            icon: Link,
            defaultMode: "config",
            tooltip: <>
                <Text>The URL when you're editing a table in Airtable.</Text>
                <Text color="dimmed">
                    Example:<br />
                    <Text span color="yellow" weight={500}>https://airtable.com/app7QmV6qHgNBOPwc/tblSNoMchfTglHOd0/viwxBMD91zjrZrWK4</Text>
                </Text>
            </>,
            renderConfiguration: ({ state, setState }) => <>
                <TextInput
                    name="airtableUrl"
                    value={state.airtableUrl ?? ""}
                    placeholder="https://airtable.com/..."
                    onChange={event => setState({ airtableUrl: event.currentTarget.value })}
                    error={state.airtableUrl === null || AirtableURLRegex.test(state.airtableUrl) ? null : "This doesn't look like a valid Airtable URL"}
                />
                {state.tableName &&
                    <Text color="dimmed" size="xs">Using "{state.tableName}"</Text>}
            </>,
        }
    ],
    outputs: ["table"],

    requiredIntegrations: ["integration:AirTable"],

    defaultState: {
        airtableUrl: null,
        baseId: null,
        tableId: null,
    },

    useNodePresent: ({ state, setState, appId, integrationsSatisfied }) => {
        // extract base ID and table ID from Airtable URL
        const [, baseId, tableId] = useMemo(() => state.airtableUrl?.match(AirtableURLRegex) ?? [], [state.airtableUrl])

        // fetch table name
        const { tableName, isLoading, isError } = useTableNameFromId(integrationsSatisfied && appId, baseId, tableId)

        // sync state with node state
        useSyncWithNodeState({ tableName, isLoading, isError, baseId, tableId }, setState)
    },

    renderTextContent: ({ state, integrationsSatisfied }) => (
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
    ),
}