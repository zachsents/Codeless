import { Group, Header as MantineHeader, Text, Box } from "@mantine/core"
import { useReactFlow } from "reactflow"
import LinkIcon from '../LinkIcon'
import { TbArrowLeft, TbCloud, TbCloudUpload, TbMaximize, TbPencil, TbSettings } from 'react-icons/tb'
import { useRouter } from 'next/router'
import RenameModal from "../RenameModal"
import { SettingsTabs } from "./SettingsDrawer"
import RunManuallyButton from "../RunManuallyButton"
import { useFlowContext } from "../../modules/context"
import { useRenameFlow } from "../../modules/hooks"
import { Trigger } from "@minus/triggers"


export default function Header({ openSettings }) {

    const { query: { appId, flowId } } = useRouter()
    const flow = useFlowContext()

    const rf = useReactFlow()

    // renaming & deleting
    const [handleRename, renaming, setRenaming] = useRenameFlow(appId, flowId)

    return (
        <>
            <MantineHeader height={HeaderHeight} sx={{ overflow: "visible", zIndex: 200 }}>
                <Group position="center" sx={{ width: "100%", height: "100%" }} px={20}>
                    <Group spacing="xl" sx={{ flex: "1 0 0" }}>
                        <LinkIcon
                            label="Back to Dashboard"
                            href={`/app/${appId}/flows`}
                            variant="light" mr={20}><TbArrowLeft fontSize={24} /></LinkIcon>

                        <Group spacing="sm">
                            {/* <LinkIcon
                                label="Random Control"
                                variant="light"><TbFileAnalytics fontSize={24} /></LinkIcon>
                            <LinkIcon
                                label="Random Control"
                                variant="light"><TbMoon2 fontSize={24} /></LinkIcon> */}
                            <LinkIcon
                                onClick={() => rf.fitView()}
                                label="Fit View to Nodes"
                                variant="light"><TbMaximize fontSize={24} /></LinkIcon>
                        </Group>
                    </Group>
                    <Group spacing="xs">
                        <Text>{flow?.name}</Text>
                        <LinkIcon
                            onClick={() => setRenaming(true)}
                            label="Edit Title"
                            variant="transparent"><TbPencil /></LinkIcon>
                    </Group>
                    <Group spacing="sm" position="right" sx={{ flex: "1 0 0" }}>
                        {flow?.trigger == Trigger.Manual && flow?.deployed &&
                            <Box mr={30}>
                                <RunManuallyButton flow={flow} includeScheduling />
                            </Box>}
                        {flow?.deployed ?
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
                            onClick={() => openSettings?.(SettingsTabs.General)}
                            label="Settings"
                            variant="light"><TbSettings fontSize={24} /></LinkIcon>
                    </Group>
                </Group>
            </MantineHeader>

            <RenameModal name={flow?.name} opened={renaming} setOpened={setRenaming} onRename={handleRename} />
        </>
    )
}

export const HeaderHeight = 60

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