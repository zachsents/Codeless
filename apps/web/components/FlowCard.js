import { ActionIcon, Badge, Box, Button, Card, Center, Group, Loader, Menu, Modal, Text, Tooltip, useMantineTheme } from '@mantine/core'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { TbEdit, TbCopy, TbTrash, TbRun, TbFaceId, TbFaceIdError, TbPencil, TbWorldOff, TbPlugConnectedX } from "react-icons/tb"
import { TfiMoreAlt } from "react-icons/tfi"
import { firestore } from '../modules/firebase'
import { useAppId } from '../modules/hooks'
import DeleteModal from './DeleteModal'
import RenameModal from './RenameModal'
import { Sparklines, SparklinesCurve, SparklinesLine } from 'react-sparklines'
import FloatingMenu from './FloatingMenu'


export default function FlowCard({ flow }) {

    const appId = useAppId()

    // deleting state & handlers
    const [deleting, setDeleting] = useState(false)
    const handleDelete = () => deleteDoc(doc(firestore, "apps", appId, "flows", flow.id))

    // renaming state & handlers
    const [renaming, setRenaming] = useState(false)
    const handleRename = newName => updateDoc(
        doc(firestore, "apps", appId, "flows", flow.id),
        { name: newName }
    )

    return (
        <>
            <Card shadow="sm" p="xl" mb={30} radius="lg" sx={{ overflow: "visible" }}>
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
                                {!flow.published &&
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
                        <Tooltip label="Edit Flow" withArrow>
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
                                <Menu.Item icon={<TbRun />}>View Runs</Menu.Item>
                                <Menu.Item onClick={() => setRenaming(true)} icon={<TbPencil />}>Rename Flow</Menu.Item>
                                <Menu.Item icon={<TbCopy />}>Duplicate Flow</Menu.Item>
                                <Menu.Item onClick={() => setDeleting(true)} icon={<TbTrash />} color="red">Delete Flow</Menu.Item>
                            </Menu.Dropdown>
                        </FloatingMenu>
                    </Group>
                </Group>
            </Card>

            <DeleteModal name={flow.name} opened={deleting} setOpened={setDeleting} onDelete={handleDelete} />
            <RenameModal name={flow.name} opened={renaming} setOpened={setRenaming} onRename={handleRename} />
        </>
    )
}
