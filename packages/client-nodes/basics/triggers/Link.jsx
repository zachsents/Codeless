import { ActionIcon, Code, CopyButton, Group, Stack, Text } from "@mantine/core"
import { Copy, Check, ExternalLink, Link } from "tabler-icons-react"


export default {
    id: "basic:LinkTrigger",
    name: "When a URL is visited",
    description: "Triggered when URL is accessed.",
    icon: Link,

    inputs: [],
    outputs: ["$"],

    deletable: false,
    hideInBrowser: true,

    deploy: ({ flowId }) => {

        const deploymentUrl = `${process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL}/flow-runFromUrl?flow_id=${flowId}`
    
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
    },
}
