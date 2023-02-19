import { useRouter } from "next/router"
import Link from "next/link"
import { Group, Header as MantineHeader, Text, Title, Tooltip, Button } from "@mantine/core"
import { openContextModal } from "@mantine/modals"
import { TbArrowLeft, TbCloud, TbCloudUpload, TbPencil, TbSettings, TbExclamationMark, TbCheck, TbLayoutList } from "react-icons/tb"
import { Triggers } from "@minus/client-nodes"

import { useFlowContext } from "../../modules/context"
import LinkIcon from "../LinkIcon"
import { SettingsTabs } from "./SettingsDrawer"
import FlowControlButton from "../FlowControlButton"


export default function Header({ openSettings }) {

    const { query: { appId, flowId } } = useRouter()
    const { flow } = useFlowContext()

    // renaming
    const handleOpenRenameModal = () => {
        openContextModal({
            modal: "RenameFlow",
            innerProps: { flowId, oldName: flow.name },
            title: <Title order={3}>Rename "{flow.name}"</Title>,
            size: "lg",
        })
    }

    // displaying if there's errors
    const hasErrors = Object.keys(flow?.runs?.[0]?.errors ?? {}).length > 0

    return (
        <>
            <MantineHeader height={HeaderHeight} sx={{ overflow: "visible", zIndex: 200 }}>
                <Group position="center" sx={{ width: "100%", height: "100%" }} px={20}>
                    <Group spacing="xl" sx={{ flex: "1 0 0" }}>
                        <Link href={`/app/${appId}/flows`}>
                            <Tooltip label="Back to Flows">
                                <Button color="gray" variant="light">
                                    <Group spacing="xs">
                                        <TbArrowLeft size={16} /><TbLayoutList size={20} />
                                    </Group>
                                </Button>
                            </Tooltip>
                        </Link>
                    </Group>
                    <Group spacing="xs">
                        <Text>{flow?.name}</Text>
                        <LinkIcon
                            onClick={handleOpenRenameModal}
                            label="Edit Title"
                            variant="transparent"><TbPencil /></LinkIcon>
                    </Group>
                    <Group spacing="sm" position="right" sx={{ flex: "1 0 0" }}>

                        {flow?.published &&
                            <Group spacing="xs" mr={30}>
                                {Triggers[flow.trigger]?.controls?.map((control, i) =>
                                    <FlowControlButton
                                        {...control}
                                        flow={flow}
                                        key={i}
                                    />
                                )}
                            </Group>}

                        {hasErrors ?
                            <LinkIcon
                                onClick={() => openSettings?.(SettingsTabs.Errors)}
                                label="Click to view errors."
                                variant="filled"
                                color="red"><TbExclamationMark fontSize={24} /></LinkIcon>
                            :
                            <LinkIcon
                                onClick={() => openSettings?.(SettingsTabs.Errors)}
                                label="No errors!"
                                variant="light"><TbCheck fontSize={24} /></LinkIcon>
                        }

                        {flow?.published ?
                            <LinkIcon
                                onClick={() => openSettings?.(SettingsTabs.Deployment)}
                                label="Your flow is live!"
                                variant="filled"
                                color="green"><TbCloud fontSize={24} /></LinkIcon>
                            :
                            <LinkIcon
                                onClick={() => openSettings?.(SettingsTabs.Deployment)}
                                label="Not yet published"
                                variant="light"><TbCloudUpload fontSize={24} /></LinkIcon>
                        }
                        <LinkIcon
                            onClick={() => openSettings?.()}
                            label="Settings"
                            variant="light"><TbSettings fontSize={24} /></LinkIcon>
                    </Group>
                </Group>
            </MantineHeader>
        </>
    )
}

export const HeaderHeight = 60
