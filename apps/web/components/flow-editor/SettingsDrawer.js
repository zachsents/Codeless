import { Box, Button, Divider, Drawer, Group, Space, Stack, Tabs, Text, Textarea, ThemeIcon, Title, useMantineTheme } from '@mantine/core'
import { doc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { TbCheck, TbCloud, TbCloudOff, TbCloudUpload, TbCopy, TbMoon2, TbPencil, TbTrash } from 'react-icons/tb'
import { useFlowContext } from '../../modules/context'
import { firestore } from '../../modules/firebase'
import { useAppId, useDebouncedCustomState, useDeleteFlow, useRenameFlow } from '../../modules/hooks'
import { Nodes } from '../../modules/nodes'
import DeleteModal from '../DeleteModal'
import LinkIcon from '../LinkIcon'
import RenameModal from '../RenameModal'
import { HeaderHeight } from './Header'

export default function SettingsDrawer({ opened, onClose, suggestedTab }) {

    const theme = useMantineTheme()
    const appId = useAppId()
    const flow = useFlowContext()

    const [activeTab, setActiveTab] = useState(SettingsTabs.General)

    // select suggested tab whenever it changes
    useEffect(() => {
        suggestedTab && setActiveTab(suggestedTab)
    }, [suggestedTab])

    // description state
    const [description, setDescription] = useDebouncedCustomState(flow?.description, newDesc => {
        flow?.id && updateDoc(
            doc(firestore, "apps", appId, "flows", flow.id),
            { description: newDesc }
        )
    }, 1000)

    // renaming & deleting
    const [handleRename, renaming, setRenaming] = useRenameFlow(appId, flow?.id)
    const [handleDelete, deleting, setDeleting] = useDeleteFlow(appId, flow?.id)

    // deploy
    const setDeployed = deployed => updateDoc(
        doc(firestore, "apps", appId, "flows", flow.id),
        { deployed, }
    )

    // deployment content from trigger node
    const DeployInfo = Nodes[flow?.trigger]?.deploy

    return (
        <>
            <Drawer
                position="right"
                opened={opened}
                onClose={() => onClose?.()}
                padding="sm"
                size="lg"
                // withinPortal={false}
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
                <Group
                    spacing="md"
                    // position="center"
                    px={30}
                    py={8}
                    mx={-theme.spacing.sm}
                    sx={{ backgroundColor: theme.colors.gray[1] }}
                >
                    <LinkIcon
                        label="Redeploy"
                        disabled
                        variant="transparent"><TbCloudUpload fontSize={24} /></LinkIcon>
                    <LinkIcon
                        label="Rename Flow"
                        onClick={() => setRenaming(true)}
                        variant="transparent"><TbPencil fontSize={24} /></LinkIcon>
                    <LinkIcon
                        label="Duplicate Flow"
                        disabled
                        variant="transparent"><TbCopy fontSize={24} /></LinkIcon>
                    <LinkIcon
                        label="Delete Flow"
                        onClick={() => setDeleting(true)}
                        variant="transparent"><TbTrash fontSize={24} /></LinkIcon>
                </Group>
                <Space h={20} />
                <Tabs value={activeTab} onTabChange={setActiveTab}>
                    <Tabs.List grow>
                        <Tabs.Tab value={SettingsTabs.General}>General</Tabs.Tab>
                        <Tabs.Tab value={SettingsTabs.Deployment}>Deployment</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value={SettingsTabs.General} p="md">
                        <Textarea
                            label="Description"
                            labelProps={{ size: "xs", px: "sm", }}
                            placeholder="Write a description..."
                            value={description ?? ""}
                            onChange={event => setDescription(event.currentTarget.value)}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value={SettingsTabs.Deployment} p="md">
                        <Space h={20} />
                        <Stack align="center">
                            {flow?.deployed ?
                                <>
                                    <Group position="center">
                                        <ThemeIcon radius="md" color="green"><TbCheck /></ThemeIcon>
                                        <Text color="green" weight={600}>Your flow is live!</Text>
                                    </Group>
                                    <Button onClick={() => setDeployed(false)} variant="subtle" color="gray" rightIcon={<TbCloudOff />} mt={10}>Unpublish</Button>
                                </>
                                :
                                <>
                                    <Text>Your flow is not live.</Text>
                                    <Button onClick={() => setDeployed(true)} rightIcon={<TbCloudUpload />} size="md" mt={10}>Publish</Button>
                                </>
                            }
                        </Stack>
                        <Space h={20} />
                        <Divider />
                        <Space h={20} />
                        {DeployInfo && <DeployInfo appId={appId} flowId={flow?.id} />}
                    </Tabs.Panel>
                </Tabs>
            </Drawer>

            <RenameModal name={flow?.name} opened={renaming} setOpened={setRenaming} onRename={handleRename} />
            <DeleteModal name={flow?.name} opened={deleting} setOpened={setDeleting} onDelete={handleDelete} />
        </>
    )
}


export const SettingsTabs = {
    General: "general",
    Deployment: "deployment",
}

