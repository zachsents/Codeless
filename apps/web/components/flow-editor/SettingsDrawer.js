import { Box, Drawer, Group, Space, Tabs, Text, Title, useMantineTheme } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { TbMoon2 } from 'react-icons/tb'
import { useFlowContext } from '../../modules/context'
import LinkIcon from '../LinkIcon'
import { HeaderHeight } from './Header'

export default function SettingsDrawer({ opened, onClose, suggestedTab }) {

    const theme = useMantineTheme()
    const flow = useFlowContext()

    const [activeTab, setActiveTab] = useState(SettingsTabs.General)

    // select suggested tab whenever it changes
    useEffect(() => {
        suggestedTab && setActiveTab(suggestedTab)
    }, [suggestedTab])

    return (
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
            <Group
                spacing="md"
                px={30}
                py={8}
                mx={-theme.spacing.sm}
                sx={{ backgroundColor: theme.colors.gray[1] }}
            >
                <LinkIcon
                    label="Random Control"
                    variant="transparent"><TbMoon2 fontSize={24} /></LinkIcon>
                <LinkIcon
                    label="Random Control"
                    variant="transparent"><TbMoon2 fontSize={24} /></LinkIcon>
                <LinkIcon
                    label="Random Control"
                    variant="transparent"><TbMoon2 fontSize={24} /></LinkIcon>
                <LinkIcon
                    label="Random Control"
                    variant="transparent"><TbMoon2 fontSize={24} /></LinkIcon>
                <LinkIcon
                    label="Random Control"
                    variant="transparent"><TbMoon2 fontSize={24} /></LinkIcon>
            </Group>
            <Space h={20} />
            <Tabs value={activeTab} onTabChange={setActiveTab}>
                <Tabs.List grow>
                    <Tabs.Tab value={SettingsTabs.General}>General</Tabs.Tab>
                    <Tabs.Tab value={SettingsTabs.Deployment}>Deployment</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value={SettingsTabs.General} p="md">
                    <Text>
                        Maybe here we can put a description of the flow? I'm not entirely sure what to put.
                    </Text>
                </Tabs.Panel>
                <Tabs.Panel value={SettingsTabs.Deployment} p="md">

                </Tabs.Panel>
            </Tabs>
        </Drawer>
    )
}


export const SettingsTabs = {
    General: "general",
    Deployment: "deployment",
}

