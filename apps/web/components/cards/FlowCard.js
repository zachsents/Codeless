import { useCallback, useMemo } from 'react'
import Link from 'next/link'
import { ActionIcon, Badge, Box, Button, Group, Menu, Text, Tooltip } from '@mantine/core'
import { TfiMoreAlt } from "react-icons/tfi"
import { TbEdit, TbCopy, TbTrash, TbRun, TbFaceId, TbFaceIdError, TbPencil, TbRotateClockwise2 } from "react-icons/tb"
import { functions } from '../../modules/firebase'
import { useAppId, useDeleteFlow, useRenameFlow } from '../../modules/hooks'
import { openDeleteModal, openRenameModal } from '../../modules/modals'
import FloatingMenu from '../FloatingMenu'
import OurCard from './OurCard'
import { httpsCallable } from 'firebase/functions'
import { Trigger } from 'triggers'


export default function FlowCard({ flow }) {

    const appId = useAppId()

    // renaming & deleting
    const [handleRename] = useRenameFlow(appId, flow.id)
    const [handleDelete] = useDeleteFlow(appId, flow.id)

    // run flow manually
    const runFlowManually = useCallback(() => {
        appId && flow.id && httpsCallable(functions, "callable")({ appId, flowId: flow.id })
            .then(response => console.log(response))
    }, [appId, flow.id])

    return (
        <>
            <OurCard>
                <Group position="apart">
                    <Group spacing="xl">
                        {flow.error ?
                            <Tooltip label={`${flow.error} Click for more info`} withArrow>
                                <ActionIcon variant="transparent" color="red"><TbFaceIdError fontSize={28} /></ActionIcon>
                            </Tooltip>
                            :
                            <Tooltip label="Good to go!" withArrow>
                                <ActionIcon variant="transparent" color="gray"><TbFaceId fontSize={28} /></ActionIcon>
                            </Tooltip>}
                        <Box>
                            <Group align="center">
                                {!flow.deployed &&
                                    <Tooltip label="This flow isn't live." withArrow>
                                        <Badge color="gray">Draft</Badge>
                                    </Tooltip>}
                                <Text size="lg" weight={600} mb={5}>{flow.name}</Text>
                            </Group>
                            <Text color="dimmed">Trigger: Collection Item created</Text>
                        </Box>
                    </Group>
                    <Group spacing="xl">
                        {/* <Box sx={{ width: "25vw", maxWidth: 400 }}>
                            <Sparklines data={[0, 0, 0, 20, 5, 0, 3, 4, 15, 20, 0, 2]} max={20} width={120} height={12}>
                                <SparklinesCurve color={theme.colors.gray[5]} />
                            </Sparklines>
                        </Box> */}
                        {flow.trigger == Trigger.Manual &&
                            <Button onClick={runFlowManually} leftIcon={<TbRun />}>Run Flow</Button>}
                        <Tooltip label="Edit Flow">
                            <div>
                                <Link href={`/app/${appId}/flow/${flow.id}/edit`}>
                                    <ActionIcon component="a" variant="transparent" color="dark"><TbEdit fontSize={28} /></ActionIcon>
                                </Link>
                            </div>
                        </Tooltip>
                        <FloatingMenu>
                            <Menu.Target>
                                <ActionIcon variant="transparent" color="dark"><TfiMoreAlt fontSize={20} /></ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item onClick={runFlowManually} icon={<TbRun />}>Run Manually</Menu.Item>
                                <Menu.Item disabled icon={<TbRotateClockwise2 />}>View Runs</Menu.Item>
                                <Menu.Item onClick={() => openRenameModal(flow.name, handleRename)} icon={<TbPencil />}>Rename Flow</Menu.Item>
                                <Menu.Item disabled icon={<TbCopy />}>Duplicate Flow</Menu.Item>
                                <Menu.Item onClick={() => openDeleteModal(flow.name, handleDelete)} icon={<TbTrash />} color="red">Delete Flow</Menu.Item>
                            </Menu.Dropdown>
                        </FloatingMenu>
                    </Group>
                </Group>
            </OurCard>
        </>
    )
}
