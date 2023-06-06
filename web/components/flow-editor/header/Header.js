import { Badge, Button, Divider, Group, Loader, Header as MantineHeader, Switch, Text, Tooltip } from "@mantine/core"
import Link from "next/link"
import { useRouter } from "next/router"
import { TbArrowLeft, TbLayoutList } from "react-icons/tb"

import { TriggerNodeDefinitions } from "@minus/client-nodes"
import { usePublishFlow, useUnpublishFlow } from "@minus/client-sdk"
import FlowControlButton from "@web/components/FlowControlButton"
import { useFlowContext } from "@web/modules/context"
import { useActionQuery } from "@web/modules/hooks"
import RunReplayPopover from "../run-replay/RunReplayPopover"
import FlowTitle from "./FlowTitle"


export default function Header() {

    const { query: { appId } } = useRouter()
    const { flow, dirty: isFlowUnsaved } = useFlowContext()

    // Enabling/disabling a flow
    const _publishFlow = usePublishFlow(flow?.id)
    const _unpublishFlow = useUnpublishFlow(flow?.id)
    const [enableFlow, { isFetching: isEnabling }] = useActionQuery(_publishFlow, ["publish", flow?.id])
    const [disableFlow, { isFetching: isDisabling }] = useActionQuery(_unpublishFlow, ["unpublish", flow?.id])

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
            // onClick={() => deselectAll(rf)}
            fixed={false} px="sm" py="xs" zIndex={200}
            className="ofv"
        >
            <Group position="apart">
                <Group>
                    <Link href={`/app/${appId}?tab=flows`}>
                        <Tooltip label="Back to All Workflows">
                            <Button color="gray" variant="light" size="sm">
                                <Group spacing="xs">
                                    <TbArrowLeft size="1em" /><TbLayoutList size="1.2em" />
                                </Group>
                            </Button>
                        </Tooltip>
                    </Link>

                    <FlowTitle />
                </Group>

                <Group spacing="lg">

                    {/* Saving Indicator */}
                    <Badge
                        color="gray" variant="light" size="md"
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
                    {(isEnabling || isDisabling) ?
                        <Group>
                            <Loader size="sm" />
                            <Text size="sm" color="dimmed">Working on it...</Text>
                        </Group> :
                        <Group>
                            <Badge
                                color={publishStatus.color}
                                variant="light" leftSection={<Text color={publishStatus.color} size="xl">&bull;</Text>}
                                size="lg"
                            >
                                {publishStatus.label}
                            </Badge>
                            <Switch
                                color="green"
                                size="sm"
                                checked={flow?.published}
                                onChange={flow?.published ? disableFlow : enableFlow}
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
