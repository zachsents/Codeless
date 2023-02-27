import { useReactFlow } from "reactflow"
import { motion } from "framer-motion"
import {
    Card, Stack, Group, Tooltip, ActionIcon, ThemeIcon, Title, Badge, Accordion, Button, Flex
} from "@mantine/core"
import { TbChevronLeft, TbChevronRight, TbExternalLink, TbX } from "react-icons/tb"

import { useAccordionValue, useConfigStore, usePanelMaximized } from "./config-store"
import { useAppContext } from "../../../modules/context"
import { useAppId } from "../../../modules/hooks"
import { deselectNode, getNodeIntegrationsStatus, getNodeType } from "@minus/graph-util"
import ProblemsSection from "./ProblemsSection"
import OutputsSection from "./OutputsSection"
import OptionsSection from "./OptionsSection"
import IntegrationAlert from "./IntegrationAlert"


export default function NodeConfig({ node }) {

    const rf = useReactFlow()

    const appId = useAppId()
    const { integrations: appIntegrations } = useAppContext()

    const nodeType = getNodeType(node)
    const hasConfiguration = !!nodeType.configuration

    // pull some state from config store -- doesn't need to be persisted between refreshes 
    const panelMaximized = usePanelMaximized(node.id)
    const accordionValue = useAccordionValue(node.id)
    const { togglePanelMaximized, setAccordionValue } = useConfigStore(s => s.actions)

    const nodeIntegrations = getNodeIntegrationsStatus(nodeType, appIntegrations)

    return (
        <Card
            radius="md" shadow="sm" mah="100%"

            component={motion.div}
            animate={{ width: panelMaximized ? 500 : 300 }}
            transition={{ type: "spring", duration: 0.3, spring: 0.5 }}
        >
            <Stack spacing="xl">

                {/* Header */}
                <Group spacing="xs" position="apart" noWrap align="start">
                    <Stack spacing="xs">

                        <Tooltip label={panelMaximized ? "Collapse" : "Expand"} position="left" withinPortal>
                            <ActionIcon
                                onClick={() => togglePanelMaximized(node.id)}
                                radius="md"
                                variant="light"
                            >
                                {panelMaximized ? <TbChevronRight /> : <TbChevronLeft />}
                            </ActionIcon>
                        </Tooltip>

                        <Group noWrap>
                            {nodeType.color ?
                                <ThemeIcon color={nodeType.color} size="lg" radius="xl">
                                    <nodeType.icon size={18} />
                                </ThemeIcon>
                                :
                                <nodeType.icon size={22} />
                            }
                            <Title order={3}>{nodeType.name}</Title>
                        </Group>

                        <Group>
                            {nodeType.badge &&
                                <Badge color={nodeType.color ?? "gray"}>
                                    {nodeType.badge}
                                </Badge>}
                            {node.id == "trigger" && <Badge>Trigger</Badge>}
                        </Group>
                    </Stack>

                    <ActionIcon radius="md" onClick={() => deselectNode(rf, node.id)}>
                        <TbX />
                    </ActionIcon>
                </Group>

                {/* Integration Alerts */}
                <Stack spacing="sm">
                    {nodeIntegrations.map(
                        int => <IntegrationAlert integration={int} key={int.id} />
                    )}

                    {nodeIntegrations.length > 0 &&
                        <Flex justify="flex-end">
                            <Button
                                component="a"
                                href={`/app/${appId}/integrations`}
                                target="_blank"
                                rightIcon={<TbExternalLink />}
                                size="xs"
                                compact
                                variant="light"
                                color="gray"
                            >
                                Open Integrations
                            </Button>
                        </Flex>}
                </Stack>

                {/* Body */}
                <Accordion
                    variant="separated"
                    value={accordionValue === undefined ? (hasConfiguration ? "options" : null) : accordionValue}
                    onChange={val => setAccordionValue(node.id, val)}
                    styles={accordionStyles}
                >
                    {/* Options */}
                    {hasConfiguration &&
                        <OptionsSection nodeId={node.id} active={accordionValue == "options"} />}

                    {/* Outputs */}
                    {nodeType.outputs?.length > 0 &&
                        <OutputsSection nodeId={node.id} active={accordionValue == "testing"} />}

                    {/* Problems */}
                    <ProblemsSection nodeId={node.id} active={accordionValue == "errors"} />
                </Accordion>
            </Stack>
        </Card>
    )
}


const accordionStyles = theme => ({
    item: { border: "none" },
    content: { padding: theme.spacing.xs },
    label: { overflow: "visible" },
})