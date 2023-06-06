import { Button, Group, Select, Stack, Text, ThemeIcon } from "@mantine/core"
import { Integrations } from "@minus/client-nodes"
import { useIntegrationAccounts } from "@minus/client-nodes/hooks/nodes"
import { useAppContext } from "@web/modules/context"
import { useEffect } from "react"
import { TbPlus } from "react-icons/tb"


export default function IntegrationAlert({ id }) {

    const integration = Integrations[id]

    const { app } = useAppContext()
    const { selectAccount: _select, selectedAccounts: _selected, availableAccounts: _available } = useIntegrationAccounts(null, app)
    const select = accountId => _select(id, accountId)
    const selected = _selected[id]
    const available = _available[id]

    // Side-effect: select the only available account
    useEffect(() => {
        if (available.length == 1 && !selected)
            select(available[0].id)
    }, [JSON.stringify(available)])

    return (
        <Stack spacing="xxxs">
            <Group spacing="xs">
                <ThemeIcon color={integration.color}>
                    <integration.icon size="0.9rem" />
                </ThemeIcon>
                <Text size="sm" weight={500} >
                    {integration.name}
                </Text>
            </Group>

            {available.length > 0 &&
                <Select
                    data={available.map(account => ({ value: account.id, label: account.nickname }))}
                    value={selected}
                    onChange={select}
                    placeholder="Select an account"
                    size="xs" withinPortal
                />}

            <Button
                component="a"
                href={`/app/${app?.id}?tab=integrations&integration=${id}`}
                target="_blank"
                variant="subtle"
                color={integration.color} size="xs" compact
                leftIcon={<TbPlus />}
            >
                Connect {available.length > 0 ? "another" : ""} account
            </Button>
        </Stack>
    )
}