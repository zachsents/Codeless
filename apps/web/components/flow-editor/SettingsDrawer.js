import React, { useEffect, useState } from "react"
import { Box, Button, Center, Divider, Drawer, Group, Loader, Space, Stack, Tabs, Text, ThemeIcon, Title, useMantineTheme } from "@mantine/core"
import { openContextModal } from "@mantine/modals"
import { TbCheck, TbCloudOff, TbCloudUpload, TbCopy, TbExclamationMark, TbPencil, TbTrash } from "react-icons/tb"
import { usePublishFlow, useUnpublishFlow } from "@minus/client-sdk"

import { useFlowContext } from "../../modules/context"
import { useAppId } from "../../modules/hooks"
import { Nodes } from "../../modules/nodes"
import LinkIcon from "../LinkIcon"
import { HeaderHeight } from "./Header"


export default function SettingsDrawer({ opened, onClose, suggestedTab, onOpenedSuggestedTab }) {

    const theme = useMantineTheme()

    const appId = useAppId()
    const { flow } = useFlowContext()
    const publishFlow = usePublishFlow(flow?.id)
    const unpublishFlow = useUnpublishFlow(flow?.id)

    const [publishLoading, setPublishLoading] = useState(false)
    const [activeTab, setActiveTab] = useState(SettingsTabs.Deployment)

    const handlePublishChange = async func => {
        setPublishLoading(true)
        await func()
        setPublishLoading(false)
    }

    // select suggested tab whenever it changes
    useEffect(() => {
        if (suggestedTab) {
            setActiveTab(suggestedTab)
            onOpenedSuggestedTab?.()
        }
    }, [suggestedTab])

    // renaming & deleting
    const handleOpenRenameModal = () => {
        flow && openContextModal({
            modal: "RenameFlow",
            innerProps: { flowId: flow.id, oldName: flow.name },
            title: <Title order={3}>Rename "{flow.name}"</Title>,
            size: "lg",
        })
    }
    const handleOpenDeleteModal = () => {
        flow && openContextModal({
            modal: "DeleteFlow",
            innerProps: { flowId: flow.id, redirectToApp: appId },
            title: <Title order={3}>Delete "{flow.name}"</Title>,
            size: "lg",
        })
    }

    // deployment content from trigger node
    const DeployInfo = Nodes[flow?.trigger]?.deploy

    // prep errors
    const errors = Object.values(flow?.runs?.[0]?.errors ?? {}).flat()

    return (
        <>
            <Drawer
                position="right"
                opened={opened}
                onClose={() => onClose?.()}
                padding="sm"
                size="lg"
                overlayOpacity={0}
                shadow="sm"
                zIndex={100}
                transitionDuration={150}
                styles={{
                    drawer: {
                        marginTop: HeaderHeight,
                    },
                    header: {
                        flexDirection: "row-reverse",
                    }
                }}
            >
                <Title px="md" order={5}>{flow?.name}</Title>
                <Space h={10} />
                <Text px="md" pb={5} size="xs" color="dimmed">Quick Actions</Text>

                {/* Quick Actions */}
                <Group
                    spacing="md"
                    // position="center"
                    px={30}
                    py={8}
                    mx={-theme.spacing.sm}
                    sx={{ backgroundColor: theme.colors.gray[1] }}
                >
                    <LinkIcon
                        label="Rename Flow"
                        onClick={handleOpenRenameModal}
                        variant="transparent"><TbPencil fontSize={24} /></LinkIcon>
                    <LinkIcon
                        label="Duplicate Flow"
                        disabled
                        variant="transparent"><TbCopy fontSize={24} /></LinkIcon>
                    <LinkIcon
                        label="Delete Flow"
                        onClick={handleOpenDeleteModal}
                        variant="transparent"><TbTrash fontSize={24} /></LinkIcon>
                </Group>
                <Space h={20} />

                <Tabs value={activeTab} onTabChange={setActiveTab}>
                    <Tabs.List grow>
                        <Tabs.Tab value={SettingsTabs.Deployment}>Deployment</Tabs.Tab>
                        <Tabs.Tab value={SettingsTabs.Errors}>Errors</Tabs.Tab>
                    </Tabs.List>

                    {/* Deployment Panel */}
                    <Tabs.Panel value={SettingsTabs.Deployment} p="md">
                        <Space h={20} />
                        <Stack align="center">
                            {
                                publishLoading ?
                                    <Center>
                                        <Loader />
                                    </Center>
                                    :
                                    flow?.published ?
                                        <>
                                            <Group position="center">
                                                <ThemeIcon radius="md" color="green"><TbCheck /></ThemeIcon>
                                                <Text color="green" weight={600}>Your flow is live!</Text>
                                            </Group>
                                            <Button
                                                onClick={() => handlePublishChange(unpublishFlow)}
                                                rightIcon={<TbCloudOff />}
                                                variant="subtle"
                                                color="gray"
                                                mt={10}
                                            >
                                                Unpublish
                                            </Button>
                                        </>
                                        :
                                        <>
                                            <Text>Your flow is not live.</Text>
                                            <Button
                                                onClick={() => handlePublishChange(publishFlow)}
                                                rightIcon={<TbCloudUpload />}
                                                size="md"
                                                mt={10}
                                            >
                                                Publish
                                            </Button>
                                        </>
                            }
                        </Stack>
                        <Space h={20} />
                        <Divider />
                        <Space h={20} />
                        {DeployInfo && <DeployInfo appId={appId} flowId={flow?.id} />}
                    </Tabs.Panel>

                    {/* Errors Panel */}
                    <Tabs.Panel value={SettingsTabs.Errors} p="md">
                        {errors.length > 0 ?
                            <>
                                <Space h="lg" />
                                <Text align="center" color="dimmed">Errors were encountered while running your flow.</Text>
                                <Space h="lg" />
                                {errors.map((error, i) =>
                                    <Group noWrap spacing="lg" p="sm" mx={-10} sx={errorStyle} key={"err" + i}>
                                        <ThemeIcon color="red.7" size="sm">
                                            <TbExclamationMark />
                                        </ThemeIcon>
                                        <Box>
                                            <Text size="sm" weight={500}>{error.type}</Text>
                                            <Text size="sm" color="dimmed">{error.message}</Text>
                                        </Box>
                                    </Group>
                                )}
                            </>
                            :
                            <Group position="center" mt={20}>
                                <ThemeIcon radius="md" color="green"><TbCheck /></ThemeIcon>
                                <Text color="green" weight={600}>No errors!</Text>
                            </Group>
                        }
                    </Tabs.Panel>
                </Tabs>
            </Drawer>
        </>
    )
}


export const SettingsTabs = {
    Deployment: "deployment",
    Errors: "errors",
}


const errorStyle = theme => ({
    borderRadius: theme.radius.lg,
    cursor: "pointer",
    "&:hover": {
        backgroundColor: theme.colors.gray[1],
    },
})