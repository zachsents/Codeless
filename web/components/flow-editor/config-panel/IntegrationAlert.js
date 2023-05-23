import { Group, Select, Text, ThemeIcon } from "@mantine/core"

import { Integrations } from "@minus/client-nodes"
import { useIntegrationAccounts } from "@minus/client-nodes/hooks/nodes"
import { useAppContext } from "@web/modules/context"


export default function IntegrationAlert({ id }) {

    const integration = Integrations[id]

    const { app } = useAppContext()
    const { selectAccount: _select, selectedAccounts: _selected, availableAccounts: _available } = useIntegrationAccounts(null, app)
    const select = accountId => _select(id, accountId)
    const selected = _selected[id]
    const available = _available[id]

    return (
        <Group position="apart" px="sm">
            <Group spacing="xs">
                <ThemeIcon color={integration.color}>
                    <integration.icon size="0.9rem" />
                </ThemeIcon>
                <Text size="sm" weight={500} >
                    {integration.name}
                </Text>
            </Group>

            <Select
                data={available.map(account => ({ value: account.id, label: account.nickname }))}
                value={selected}
                onChange={select}
                size="xs" withinPortal
            />
        </Group>
    )
}