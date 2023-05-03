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
import Breadcrumbs from "./Breadcrumbs"


export default function Header() {

    const rf = useReactFlow()
    const { query: { appId } } = useRouter()
    const { flow } = useFlowContext()

    const publishFlow = usePublishFlow(flow?.id)
    const unpublishFlow = useUnpublishFlow(flow?.id)
    const [isPublishing, setIsPublishing] = useState(false)

    const handlePublishChange = async value => {
        setIsPublishing(true)
        await (value ? publishFlow : unpublishFlow)()
        setIsPublishing(false)
    }

    return (
        <MantineHeader
            onClick={() => deselectAll(rf)}
            fixed={false} p="sm" zIndex={200} sx={{ overflow: "visible" }}
        >
            <Group position="apart">
                <Group>
                    <Link href={`/app/${appId}/flows`}>
                        <Tooltip label="Back to Flows">
                            <Button color="gray" variant="light">
                                <Group spacing="xs">
                                    <TbArrowLeft size={16} /><TbLayoutList size={20} />
                                </Group>
                            </Button>
                        </Tooltip>
                    </Link>
                    <Breadcrumbs />
                </Group>
                <Group spacing="xl">
                    {/* Flow Controls */}
                    <Group>
                        {flow?.published && TriggerNodeDefinitions[flow.trigger].flowControls.map(control =>
                            <FlowControlButton
                                {...control}
                                appId={appId}
                                flow={flow}
                                smallProps={{ size: "xl" }}
                                iconSize="1.5em"
                                key={control.id}
                            />
                        )}
                    </Group>

                    <Divider orientation="vertical" />

                    {/* Publishing */}
                    {isPublishing ?
                        <Group>
                            <Loader size="sm" />
                            <Text size="xs" color="dimmed">Working on it...</Text>
                        </Group> :
                        <Group>
                            {flow?.published ?
                                <Badge color="green" variant="light" size="lg" leftSection={<Text color="green" size="xl">&bull;</Text>}>
                                    Enabled
                                </Badge> :
                                <Badge color="red" variant="light" size="lg" leftSection={<Text color="red" size="xl">&bull;</Text>}>
                                    Disabled
                                </Badge>}
                            <Switch
                                color="green"
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