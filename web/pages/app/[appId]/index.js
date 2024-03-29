import {
    ActionIcon,
    Badge, Box, Button, Card, Center, Chip, Collapse, Divider, Grid, Group, Loader, Menu,
    SimpleGrid,
    Space,
    Stack, Tabs, Text, ThemeIcon, Title,
    Tooltip,
    useMantineTheme
} from "@mantine/core"
import { useDisclosure, useHover } from "@mantine/hooks"
import { openContextModal } from "@mantine/modals"
import { Integrations, TriggerNodeDefinitions } from "@minus/client-nodes"
import { functionUrl, useActionQuery, useFlowsForAppRealtime, usePublishFlow, useUnpublishFlow, useUpdateApp } from "@minus/client-sdk"
import { plural } from "@minus/util"
import EditableText from "@web/components/EditableText"
import GlassButton from "@web/components/GlassButton"
import SearchInput from "@web/components/SearchInput"
import Section from "@web/components/Section"
import AppMenu from "@web/components/dashboard/AppMenu"
import AppPageHead from "@web/components/dashboard/AppPageHead"
import Header from "@web/components/dashboard/Header"
import Footer from "@web/components/landing/Footer"
import { AppProvider, useAppContext } from "@web/modules/context"
import { useAppRenaming, useFlowRenaming, useMustBeSignedIn, useQueryParam } from "@web/modules/hooks"
import { useSearch } from "@web/modules/search"
import { jc, stopPropagation } from "@web/modules/util"
import Link from "next/link"
import { useEffect, useState } from "react"
import { TbArrowRight, TbChartDots3, TbChevronUp, TbConfetti, TbConfettiOff, TbDots, TbPencil, TbPlug, TbPlus, TbReportMoney, TbTrash } from "react-icons/tb"


export default function AppOverviewPage() {

    return (
        <AppProvider redirectOnNotExist="/apps">
            <AppOverview />
        </AppProvider>
    )
}

function AppOverview() {

    useMustBeSignedIn()

    const theme = useMantineTheme()

    // tab state
    const [tab, setTab] = useQueryParam("tab", "flows", true)

    // app state
    const { app } = useAppContext()
    // const { plan } = usePlan({ ref: app?.plan })
    const color = app?.color ?? theme.primaryColor

    // renaming an app
    const { isRenaming, startRenaming, onRename, onCancel: onRenameCancel } = useAppRenaming(app?.id)

    // flows
    const [flows] = useFlowsForAppRealtime(app?.id)

    // searching flows
    const [filteredFlows, flowsQuery, setFlowsQuery, filteredFlowNames] = useSearch(flows, {
        selector: flow => flow.name,
        highlight: true,
    })

    // keep track of "integration" param so we can show this one at the top of the list
    const [integrationParam] = useQueryParam("integration")


    return (
        <>
            <AppPageHead />

            <Header />

            <Section p="xl">
                <Grid gutter="xl">
                    <Grid.Col sm={12} md={9}>

                        <Stack pb="xl">
                            <Group align="stretch">
                                <Box w="1rem" bg={color} className="transition-colors rounded-sm" />

                                <Group py="0.25rem">

                                    {isRenaming ?
                                        <EditableText
                                            highlight
                                            initialValue={app?.name}
                                            onEdit={onRename}
                                            onCancel={onRenameCancel}
                                            size="lg"
                                        /> :
                                        <Title order={1}>{app?.name}</Title>}

                                    <AppMenu app={null} startRename={startRenaming} includeOpen={false} />
                                </Group>
                            </Group>
                        </Stack>

                        <Divider />

                        <Tabs
                            value={tab} onTabChange={setTab}
                            orientation="vertical" variant="pills" color={color}
                            pt="xl"
                        >
                            <Tabs.List miw="10rem">
                                <Tabs.Tab value="flows" icon={<TbChartDots3 />}>Workflows</Tabs.Tab>
                                <Tabs.Tab value="integrations" icon={<TbPlug />}>Integrations</Tabs.Tab>
                                <Tabs.Tab value="billing" icon={<TbReportMoney />}>Billing</Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="flows" pl="xl">
                                <Stack spacing="lg">
                                    <Group position="apart" noWrap>
                                        <Title order={3}>{flowsQuery ? `Flows matching "${flowsQuery}"` : "All Flows"}</Title>

                                        <Link href={`/app/${app?.id}/flow/create`}>
                                            <GlassButton
                                                leftIcon={<TbPlus />} radius="xl" matchColor
                                                color={color}
                                            >
                                                New Flow
                                            </GlassButton>
                                        </Link>
                                    </Group>

                                    {flows == null ?
                                        <Group position="center">
                                            <Loader size="sm" />
                                            <Text size="sm" color="dimmed">Loading flows</Text>
                                        </Group> :
                                        <>
                                            <SearchInput
                                                value={flowsQuery}
                                                onChange={event => setFlowsQuery(event.currentTarget.value)}
                                                onClear={() => setFlowsQuery("")}
                                                noun="flow"
                                                quantity={flows?.length}
                                            />

                                            {filteredFlows.length == 0 ?
                                                <Text size="sm" color="dimmed" align="center">No flows found.</Text> :

                                                <SimpleGrid cols={1}>
                                                    {filteredFlows.map((flow, i) =>
                                                        <FlowCard flow={flow} displayNameParts={filteredFlowNames[i]} key={flow.id} />
                                                    )}
                                                </SimpleGrid>}
                                        </>}
                                </Stack>
                            </Tabs.Panel>

                            <Tabs.Panel value="integrations" pl="xl">
                                <Stack spacing="lg">
                                    <Title order={3}>
                                        Integrations
                                    </Title>

                                    <SimpleGrid cols={1}>
                                        {Object.values(Integrations)
                                            // put integration param on top
                                            .sort((a, b) => a.id == integrationParam ? -1 : b.id == integrationParam ? 1 : 0)
                                            // map to cards
                                            .map(integration =>
                                                <IntegrationCard integration={integration} key={integration.id} />
                                            )}
                                    </SimpleGrid>
                                </Stack>
                            </Tabs.Panel>

                            <Tabs.Panel value="billing" pl="xl">
                                <Stack spacing="lg">
                                    <Title order={3}>
                                        Billing
                                    </Title>

                                    <Text color="dimmed" size="sm" align="center">
                                        This page isn't ready yet!
                                    </Text>
                                </Stack>
                            </Tabs.Panel>
                        </Tabs>
                    </Grid.Col>

                    <Grid.Col sm={12} md={3}>
                        <Stack>
                            <Title order={6}>Guides & Resource</Title>

                            <Text size="xs" align="center" color="dimmed">
                                Coming soon! Stayed tuned.
                            </Text>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Section>

            <Space h="10rem" />

            <Footer showCompanies={false} />
        </>
    )
}


function FlowCard({ flow, displayNameParts }) {

    const theme = useMantineTheme()

    // containing app state
    const { app } = useAppContext()

    // flow trigger info
    const TriggerIcon = TriggerNodeDefinitions[flow.trigger]?.icon

    // renaming a flow
    const { isRenaming, startRenaming, onRename, onCancel } = useFlowRenaming(flow.id)

    // enabling/disabling a flow
    const _publishFlow = usePublishFlow(flow.id)
    const _unpublishFlow = useUnpublishFlow(flow.id)
    const [enableFlow, { isFetching: isEnabling }] = useActionQuery(_publishFlow, ["publish", flow.id])
    const [disableFlow, { isFetching: isDisabling }] = useActionQuery(_unpublishFlow, ["unpublish", flow.id])

    const handleEnableClick = e => {
        stopPropagation(e)
        flow.published ? disableFlow() : enableFlow()
    }

    // enabled/disabled props
    const enablingProps = {
        color: flow.published ? "green" : "gray",
        text: flow.published ? "Enabled" : "Disabled",
        tooltip: flow.published ? "Disable?" : "Enable?",
    }

    // deleting a flow
    const openDeleteModal = () => openContextModal({
        modal: "DeleteFlow",
        title: `Delete ${flow.name}`,
        innerProps: { flowId: flow.id },
    })

    // hover state
    const { hovered, ref: hoverRef } = useHover()

    // display name assembly
    const displayName = displayNameParts ?
        displayNameParts.map((part, i) => i % 2 == 0 ? part : <span className="text-yellow-800" key={i}>{part}</span>) :
        flow.name

    // edit url
    const editUrl = `/app/${app?.id}/flow/${flow.id}/edit`

    /**
     * Trials & tribulations for making the text overflow properly:
     * Stack - overflow-hidden flex-1
     * Group - maw=100%
     * Text - truncate flex-1
     */
    const cardComponent = (
        <Card withBorder p="sm" className="cursor-pointer shadow-xs" ref={hoverRef}>
            <Stack spacing="0.2em">
                <Group position="apart" noWrap>
                    <Stack spacing="0.2em" align="flex-start" className="overflow-hidden flex-1">
                        {isRenaming ?
                            <EditableText
                                highlight
                                initialValue={flow.name}
                                onEdit={onRename}
                                onCancel={onCancel}
                            /> :
                            <Group noWrap maw="100%">
                                <Text weight={500} className="truncate flex-1">{displayName}</Text>

                                {isEnabling || isDisabling ?
                                    <Loader size="1em" /> :
                                    <Tooltip label={enablingProps.tooltip} position="top" withinPortal>
                                        <Badge
                                            component="button"
                                            color={enablingProps.color} size="sm"
                                            className="hover:scale-105 transition-transform"
                                            onClick={handleEnableClick}
                                        >
                                            {enablingProps.text}
                                        </Badge>
                                    </Tooltip>}
                            </Group>}

                        <Group spacing="xs">
                            <Center>
                                <TriggerIcon size="1em" color={theme.colors.gray[theme.fn.primaryShade()]} />
                            </Center>
                            <Text size="xs" color="dimmed">
                                Trigger: {TriggerNodeDefinitions[flow.trigger]?.name}
                            </Text>
                        </Group>
                    </Stack>

                    {/* {flow?.published &&
                        <Group spacing="xs" onClick={stopPropagation}>
                            {TriggerNodeDefinitions[flow.trigger].flowControls.map(control =>
                                <FlowControlButton
                                    {...control}
                                    appId={app?.id}
                                    flow={flow}
                                    key={control.id}
                                />
                            )}
                        </Group>} */}
                </Group>

                <Group position="apart" className="translate-y-1">
                    <Menu withinPortal shadow="md">
                        <Menu.Target>
                            <ActionIcon onClick={stopPropagation}>
                                <TbDots />
                            </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown miw="10rem" onClick={stopPropagation}>
                            <Menu.Item icon={<TbArrowRight />} component={Link} href={editUrl}>
                                Open
                            </Menu.Item>

                            {!(isEnabling || isDisabling) &&
                                (flow.published ?
                                    <Menu.Item icon={<TbConfettiOff />} onClick={disableFlow}>
                                        Disable
                                    </Menu.Item> :
                                    <Menu.Item icon={<TbConfetti />} onClick={enableFlow}>
                                        Enable
                                    </Menu.Item>)}

                            <Menu.Item icon={<TbPencil />} onClick={startRenaming}>
                                Rename
                            </Menu.Item>
                            <Menu.Item icon={<TbTrash />} color="red" onClick={openDeleteModal}>
                                Delete
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>

                    <Button
                        radius="xl" size="xs" variant="subtle" compact
                        rightIcon={<TbArrowRight className={jc("transition-transform", hovered && !isRenaming && "translate-x-1")} />}
                    >
                        Open
                    </Button>
                </Group>
            </Stack>
        </Card>
    )

    return isRenaming ?
        cardComponent :
        <Link href={editUrl}>
            {cardComponent}
        </Link>
}


function IntegrationCard({ integration }) {

    // App from context
    const { app } = useAppContext()

    // Collapse state
    const [opened, handlers] = useDisclosure(false)

    // Count accounts to show in label
    const accountsQuantity = app?.integrations?.[integration.id]?.length

    // Multiple scope sets
    const [selectedScopes, setSelectedScopes] = useState(integration.scopeSets?.map(set => set.id))

    // Connect an account
    const handleConnectAccount = () => {
        const params = new URLSearchParams({ app_id: app?.id })

        // Optionally add selected scopes
        integration.scopeSets && params.append(
            "scopes",
            selectedScopes.flatMap(setId => integration.scopeSets.find(s => s.id == setId).scopes).join(",")
        )

        // Open the authorization function in a new window
        window.open(`${functionUrl(integration.authorizationFunction)}?${params.toString()}`)
    }

    // Side-effect: when query param "integration" changes, open the card
    const [integrationParam] = useQueryParam("integration")
    useEffect(() => {
        integrationParam == integration.id && handlers.open()
    }, [integrationParam])

    return (
        <Card withBorder shadow="xs">
            <Group position="apart" className="cursor-pointer" onClick={handlers.toggle}>
                <Group>
                    <ThemeIcon
                        color={integration.color || app?.color} size="xl"
                        className={jc(integration.color == "white" && "base-border")}
                    >
                        <integration.icon size={22} />
                    </ThemeIcon>
                    <Text weight={500}>{integration.name}</Text>
                </Group>

                <Group>
                    <Text color="dimmed" size="sm">
                        {accountsQuantity || "No"} {plural("account", accountsQuantity)}
                    </Text>
                    <Center className={`${opened ? "rotate-180" : ""} transition-transform`}>
                        <TbChevronUp />
                    </Center>
                </Group>
            </Group>

            <Collapse in={opened}>
                <Stack pt="xl">
                    <Divider />

                    {app?.integrations?.[integration.id]?.map(accountId =>
                        <AccountRow accountId={accountId} integration={integration} key={accountId} />
                    )}

                    <Stack spacing="xxs">
                        {integration.scopeSets &&
                            <Group spacing="xxs">
                                <Chip.Group
                                    multiple value={selectedScopes ?? []} onChange={setSelectedScopes}
                                >
                                    {integration.scopeSets.map(set =>
                                        <Chip
                                            variant="light"
                                            value={set.id}
                                            color={set.color} size="xs"
                                            classNames={{ label: "flex" }}
                                            key={set.id}
                                        >
                                            <Group noWrap spacing="xxxs">
                                                <span>{set.name}</span>
                                                <set.icon color="currentColor" size="0.75rem" />
                                            </Group>
                                        </Chip>
                                    )}
                                </Chip.Group>
                            </Group>}

                        <Button
                            onClick={handleConnectAccount}
                            disabled={integration.scopeSets && !selectedScopes?.length}
                            leftIcon={<TbPlus />} fullWidth size="xs"
                        >
                            Connect account {integration.scopeSets && selectedScopes?.length > 0 &&
                                `for ${selectedScopes.length} ${plural("service", selectedScopes.length)}`}
                        </Button>
                    </Stack>
                </Stack>
            </Collapse>
        </Card>
    )
}

function AccountRow({ accountId, integration }) {

    const { app } = useAppContext()

    // State for editing nickname
    const [editingNickname, setEditingNickname] = useState(false)
    const nickname = app?.accountNicknames?.[accountId] || accountId.split(":")[1]

    // Update nickname
    const updateApp = useUpdateApp(app?.id)
    const handleEdit = newNickname => {
        updateApp({ [`accountNicknames.${accountId}`]: newNickname })
        setEditingNickname(false)
    }

    return (
        <integration.renderAccount {...{ ...integration, app, accountId }}>
            {editingNickname ?
                <EditableText
                    highlight
                    initialValue={nickname}
                    onEdit={handleEdit}
                    onCancel={() => setEditingNickname(false)}
                    size="xs"
                /> :
                <Group>
                    <Text size="xs" ff="monospace">
                        {nickname}
                    </Text>

                    <Tooltip label="Edit Nickname">
                        <ActionIcon onClick={() => setEditingNickname(true)} size="sm">
                            <TbPencil size="0.75rem" />
                        </ActionIcon>
                    </Tooltip>

                </Group>}
        </integration.renderAccount>
    )
}
