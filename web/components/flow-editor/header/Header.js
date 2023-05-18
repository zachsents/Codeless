import { Badge, Button, Divider, Group, Loader, Header as MantineHeader, Switch, Text, Tooltip } from "@mantine/core"
import Link from "next/link"
import { useRouter } from "next/router"
import { TbArrowLeft, TbLayoutList } from "react-icons/tb"

import { TriggerNodeDefinitions } from "@minus/client-nodes"
import { usePublishFlow, useUnpublishFlow } from "@minus/client-sdk"
import FlowControlButton from "@web/components/FlowControlButton"
import { useFlowContext } from "@web/modules/context"
import { deselectAll } from "@web/modules/graph-util"
import { useState } from "react"
import { useReactFlow } from "reactflow"
import RunReplayPopover from "../run-replay/RunReplayPopover"
import FlowTitle from "./FlowTitle"


export default function Header() {

    const rf = useReactFlow()
    const { query: { appId } } = useRouter()
    const { flow, dirty: isFlowUnsaved } = useFlowContext()

    const publishFlow = usePublishFlow(flow?.id)
    const unpublishFlow = useUnpublishFlow(flow?.id)
    const [isPublishing, setIsPublishing] = useState(false)

    const handlePublishChange = async value => {
        setIsPublishing(true)
        await (value ? publishFlow : unpublishFlow)()
        setIsPublishing(false)
    }

    const publishStatus = flow?.published ? {
        label: "Enabled",
        color: "green",
    } : {
        label: "Disabled",
        color: "red",
    }

    const saveStatus = isFlowUnsaved ? {
        label: "Saving",
        color: "yellow",
    } : {
        label: "Saved",
        color: "green",
    }

    return (
        <MantineHeader
            onClick={() => deselectAll(rf)}
            fixed={false} px="xs" py="0.5rem" zIndex={200}
            className="ofv"
        >
            <Group position="apart">
                <Group>
                    <Link href={`/app/${appId}?tab=flows`}>
                        <Tooltip label="Back to All Workflows">
                            <Button color="gray" variant="light" size="xs">
                                <Group spacing="xs">
                                    <TbArrowLeft size={16} /><TbLayoutList size={20} />
                                </Group>
                            </Button>
                        </Tooltip>
                    </Link>

                    <FlowTitle />
                </Group>

                <Group spacing="lg">

                    {/* Saving Indicator */}
                    <Badge
                        color="gray" variant="light" size="sm"
                        leftSection={<Text color={saveStatus.color} size="xl">&bull;</Text>}
                    >
                        {saveStatus.label}
                    </Badge>

                    <Divider orientation="vertical" />

                    {/* Flow Controls */}
                    {flow?.published && <>
                        <Group>
                            {TriggerNodeDefinitions[flow.trigger].flowControls.map(control =>
                                <FlowControlButton
                                    {...control}
                                    appId={appId}
                                    flow={flow}
                                    key={control.id}
                                />
                            )}
                        </Group>
                        <Divider orientation="vertical" />
                    </>}

                    {/* Publishing */}
                    {isPublishing ?
                        <Group>
                            <Loader size="xs" />
                            <Text size="xs" color="dimmed">Working on it...</Text>
                        </Group> :
                        <Group>
                            <Badge
                                color={publishStatus.color}
                                variant="light" leftSection={<Text color={publishStatus.color} size="xl">&bull;</Text>}
                            >
                                {publishStatus.label}
                            </Badge>
                            <Switch
                                color="green"
                                size="xs"
                                checked={flow?.published}
                                onChange={event => handlePublishChange(event.currentTarget.checked)}
                            />
                        </Group>}

                    <Divider orientation="vertical" />

                    {/* Run Replay */}
                    <RunReplayPopover />
                </Group>
            </Group>
        </MantineHeader>
    )
}
