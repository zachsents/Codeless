import { ActionIcon, Code, CopyButton, Group, Stack, Text } from "@mantine/core"
import { World, Copy, Check, ExternalLink } from "tabler-icons-react"


export default {
    name: "Webhook",
    description: "Triggered when URL is accessed.",
    icon: World,
    signalSources: [" "],

    deploy: DeployInfo,
}

function DeployInfo({ appId, flowId }) {

    const deploymentUrl = `http://localhost:5001/nameless-948a8/us-central1/runWithUrl/${appId}/${flowId}`

    return (
        <Stack>
            <Group position="center">
                <Text>Trigger URL</Text>
                <CopyButton value={deploymentUrl}>
                    {({ copied, copy }) => (
                        <ActionIcon radius="md" color={copied ? "green" : "gray"} onClick={copy}>
                            {copied ? <Check /> : <Copy size={18} />}
                        </ActionIcon>
                    )}
                </CopyButton>
            </Group>
            <Code p="xl" sx={{ wordWrap: "break-word" }}>{deploymentUrl}</Code>
            <Group position="right">
                <ActionIcon radius="md" component="a" href={deploymentUrl} target="_blank" >
                    <ExternalLink size={18} />
                </ActionIcon>
            </Group>
        </Stack>
    )
}