import Link from 'next/link'
import { ActionIcon, Badge, Box, Button, Divider, Group, Menu, Overlay, SimpleGrid, Skeleton, Space, Stack, Text, Title, Tooltip } from '@mantine/core'
import { TfiMoreAlt } from "react-icons/tfi"
import { TbEditCircle, TbCopy, TbTrash, TbPencil, TbRotateClockwise2, TbClock, TbListDetails, TbChartDots3, TbX, TbRun, TbChevronUp } from "react-icons/tb"
import { useAppId, useDeleteFlow, useRenameFlow } from '../../modules/hooks'
import DeleteModal from '../DeleteModal'
import RenameModal from '../RenameModal'
import FloatingMenu from '../FloatingMenu'
import LinkIcon from "../LinkIcon"
import OurCard from './OurCard'
import Triggers from "@minus/triggers/display"
import { Trigger } from '@minus/triggers'
import ScheduleModal from '../ScheduleModal'
import { useClickOutside, useDisclosure } from '@mantine/hooks'
import RunManuallyButton from '../RunManuallyButton'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from "framer-motion"


export default function FlowCard({ flow }) {

    const appId = useAppId()
    const flowHasScheduledRuns = flow.scheduledRuns?.length > 0

    // expanding
    const [expanded, setExpanded] = useState(false)
    const clickOutsideRef = useClickOutside(() => setExpanded(false))

    // keep track of height
    const [boxHeight, setBoxHeight] = useState()
    const heightRef = useRef()
    useEffect(() => {
        heightRef.current?.offsetHeight && setBoxHeight(heightRef.current?.offsetHeight)
    }, [heightRef.current?.offsetHeight])

    // renaming & deleting
    const [handleRename, renaming, setRenaming] = useRenameFlow(appId, flow.id)
    const [handleDelete, deleting, setDeleting] = useDeleteFlow(appId, flow.id)

    // trigger icon
    const TriggerIcon = Triggers[flow.trigger].icon

    const expandedStyle = {
        position: "fixed",
        width: "60vw",
        top: 100,
        left: "20vw",
        zIndex: 1000,
    }


    return (
        <>
            <Box sx={{ height: boxHeight }}>
                <motion.div layout style={expanded ? expandedStyle : {}} ref={clickOutsideRef}>
                    <OurCard ref={expanded ? undefined : heightRef}>
                        {expanded ?
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} key="expanded">
                                <Stack>
                                    <Group position="apart">
                                        <Text size="xl" weight={500}>{flow.name}</Text>
                                        <ActionIcon onClick={() => setExpanded(false)} radius="xl" size="lg">
                                            <TbX />
                                        </ActionIcon>
                                    </Group>
                                    <Group position="apart" align="flex-start" >
                                        <Stack sx={{ flexBasis: 0, flexGrow: 1 }}>
                                            {flowHasScheduledRuns && 
                                            <ScheduledRuns runs={flow.scheduledRuns} />}
                                        </Stack>
                                        <Stack spacing={5} w={200} justify="flex-start">
                                            <Button {...leftButtonProps} variant="filled" leftIcon={<TbChartDots3 />}>Open Designer</Button>
                                            <Divider mx="md" my="xs" color="gray.3" />
                                            <Button {...leftButtonProps} leftIcon={<TbRun />}>Run Now</Button>
                                            <Button {...leftButtonProps} leftIcon={<TbClock />}>Schedule Run</Button>
                                            <Divider mx="md" my="xs" color="gray.3" />
                                            <Button onClick={() => setRenaming(true)} {...leftButtonProps} color="gray" leftIcon={<TbPencil />}>Rename Flow</Button>
                                            <Button onClick={() => setDeleting(true)} {...leftButtonProps} color="red" leftIcon={<TbTrash />}>Delete Flow</Button>
                                        </Stack>
                                    </Group>
                                </Stack>
                            </motion.div>
                            :
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} key="notExpanded">
                                <Stack>
                                    <Group position="apart">
                                        <Group spacing="xl">
                                            {/* {flow.error ?
                                                <Tooltip label={`${flow.error} Click for more info`} withArrow>
                                                    <ActionIcon variant="transparent" color="red"><TbFaceIdError fontSize={28} /></ActionIcon>
                                                </Tooltip>
                                                :
                                                <Tooltip label="Good to go!" withArrow>
                                                    <ActionIcon variant="transparent" color="gray"><TbFaceId fontSize={28} /></ActionIcon>
                                                </Tooltip>} */}
                                            <ActionIcon color="gray" variant="transparent"><TriggerIcon /></ActionIcon>
                                            <Box>
                                                <Group align="center">
                                                    {!flow.deployed &&
                                                        <Tooltip label="This flow isn't live." withArrow>
                                                            <Badge color="gray">Draft</Badge>
                                                        </Tooltip>}
                                                    <Text size="lg" weight={600} mb={5}>{flow.name}</Text>
                                                </Group>
                                                <Text color="dimmed">Trigger: {Triggers[flow.trigger]?.name}</Text>
                                            </Box>
                                        </Group>
                                        <Group spacing="xl">
                                            {/* <Box sx={{ width: "25vw", maxWidth: 400 }}>
                                                <Sparklines data={[0, 0, 0, 20, 5, 0, 3, 4, 15, 20, 0, 2]} max={20} width={120} height={12}>
                                                    <SparklinesCurve color={theme.colors.gray[5]} />
                                                </Sparklines>
                                            </Box> */}

                                            {flow.trigger == Trigger.Manual &&
                                                <Box mr={30}>
                                                    <RunManuallyButton flow={flow} includeScheduling />
                                                </Box>}



                                            {/* <Tooltip label="Edit Flow">
                                                <div>
                                                    <Link >
                                                        <ActionIcon component="a" variant="transparent" color="dark"><TbEditCircle fontSize={28} /></ActionIcon>
                                                    </Link>
                                                </div>
                                            </Tooltip> */}
                                            {/* <FloatingMenu>
                                                <Menu.Target>
                                                    <ActionIcon variant="transparent" color="dark"><TfiMoreAlt fontSize={20} /></ActionIcon>
                                                </Menu.Target>
                                                <Menu.Dropdown>
                                                    <Menu.Item disabled icon={<TbRotateClockwise2 />}>View Runs</Menu.Item>
                                                    <Menu.Item onClick={() => setRenaming(true)} icon={<TbPencil />}>Rename Flow</Menu.Item>
                                                    <Menu.Item disabled icon={<TbCopy />}>Duplicate Flow</Menu.Item>
                                                    <Menu.Item onClick={() => setDeleting(true)} icon={<TbTrash />} color="red">Delete Flow</Menu.Item>
                                                </Menu.Dropdown>
                                            </FloatingMenu> */}
                                        </Group>
                                    </Group>
                                    <Group position="apart" grow>
                                        <Button onClick={() => setExpanded(true)} variant="transparent" leftIcon={<TbListDetails />}>
                                            View Details
                                        </Button>
                                        <Link href={`/app/${appId}/flow/${flow.id}/edit`}>
                                            <Button variant="light" rightIcon={<TbChartDots3 />}>
                                                Open Designer
                                            </Button>
                                        </Link>
                                    </Group>
                                </Stack>
                            </motion.div>
                        }
                    </OurCard>
                </motion.div>

            </Box>

            <RenameModal name={flow.name} opened={renaming} setOpened={setRenaming} onRename={handleRename} />
            <DeleteModal name={flow.name} opened={deleting} setOpened={setDeleting} onDelete={handleDelete} />

            <AnimatePresence>
                {expanded &&
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ position: "fixed", zIndex: 950 }}
                    >
                        <Overlay color="black" opacity={0.15} sx={{ position: "fixed" }} />
                    </motion.div>}
            </AnimatePresence>
        </>
    )
}


function ScheduledRuns({ runs }) {

    const dates = useMemo(() => runs.map(run =>
        new Date(run.scheduledFor.seconds * 1000)
    ), [runs])

    const [viewingAll, setViewingAll] = useState(false)

    return (
        <>
            <Text size="lg" weight={500}>
                {dates.length > 1 && viewingAll ? "Scheduled Runs" : "Next Run"}
            </Text>
            {dates.length > 1 ?
                <>
                    {viewingAll ?
                        dates.map(date => <RunRow date={date} key={date.getTime()} />)
                        :
                        <RunRow date={dates[0]} strong />
                    }
                    <Button onClick={() => setViewingAll(!viewingAll)} color="gray" variant="subtle">
                        <Text weight={400}>
                            {viewingAll ? "Hide Scheduled Runs" : "View All Scheduled Runs"}
                        </Text>
                    </Button>
                </>
                :
                <RunRow date={dates[0]} strong />}
        </>
    )
}


function RunRow({ strong = false, date }) {

    // cancel scheduled run
    const handleCancelScheduledRun = () => {
        // TO DO: implement this
    }

    return (
        <Group position="apart" px="md">
            <Box>
                <Text size={strong ? "lg" : "sm"} color="dimmed">{date.toLocaleString(undefined, {
                    dateStyle: "full",
                })}</Text>
                <Text size={strong ? "md" : "sm"} color="dimmed">{date.toLocaleString(undefined, {
                    timeStyle: "full",
                })}</Text>
            </Box>
            <Group>
                <Button color="red" variant="subtle" onClick={handleCancelScheduledRun}>Cancel</Button>
            </Group>
        </Group>
    )
}


const leftButtonProps = {
    radius: "xl",
    variant: "subtle",
    styles: theme => ({
        inner: {
            justifyContent: "flex-start",
        }
    }),
}