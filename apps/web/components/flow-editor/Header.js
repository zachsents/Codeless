import React from 'react'
import { Box, Group, Header as MantineHeader, NavLink, Text } from "@mantine/core"
import LinkIcon from '../LinkIcon'
import Link from 'next/link'
import { TbArrowLeft, TbCloud, TbPencil, TbSettings } from 'react-icons/tb'
import { useRouter } from 'next/router'
import { useFlowRealtime } from '../../modules/hooks'

export default function Header() {

    const { query: { appId, flowId }, pathname } = useRouter()

    const flow = useFlowRealtime(appId, flowId)

    return (
        <MantineHeader height={60} sx={{ overflow: "visible", zIndex: 200 }}>
            <Group position="center" sx={{ width: "100%", height: "100%" }} px={20}>
                <Group spacing="xl" sx={{ flex: "1 0 0" }}>
                    <LinkIcon
                        label="Back to Dashboard"
                        href={`/app/${appId}/flows`}
                        variant="light" mr={20}><TbArrowLeft fontSize={24} /></LinkIcon>

                    <Box>
                        <Link href={`/app/${appId}/flow/${flowId}/edit`}>
                            <NavLink label="Edit" active={pathname.endsWith("/edit")} icon={<TbPencil />} component="a" styles={navlinkStyles} />
                        </Link>
                    </Box>
                    <Box>
                        <Link href={`/app/${appId}/flow/${flowId}/deploy`}>
                            <NavLink label="Deploy" active={pathname.endsWith("/deploy")} icon={<TbCloud />} component="a" styles={navlinkStyles} />
                        </Link>
                    </Box>
                </Group>
                <Group>
                    <Text>{flow?.name}</Text>
                </Group>
                <Group position="right" sx={{ flex: "1 0 0" }}>
                    <LinkIcon
                        label="Flow Settings"
                        href={`/app/${appId}/flows`}
                        variant="light"><TbSettings fontSize={24} /></LinkIcon>
                </Group>
            </Group>
        </MantineHeader>
    )
}


const navlinkStyles = theme => ({
    root: {
        borderRadius: theme.radius.md,
        width: 100,
        justifyContent: "center",
    },
    body: {
        flex: "0 auto",
    },
    label: {
        fontWeight: 600,
    }
})