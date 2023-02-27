import { Center, Group, Stack, Text, ThemeIcon } from "@mantine/core"
import { Mail, Mailbox } from "tabler-icons-react"

import { useAlignHandles } from "@minus/graph-util"


export default {
    id: "gmail:EmailReceivedTrigger",
    name: "When an email is received",
    description: "Triggered when an email is received in Gmail.",
    icon: Mailbox,
    color: "red",
    badge: "Gmail",

    inputs: [],
    outputs: [
        "fromName", "fromEmail", "subject", "date", "plainText", {
            name: "html",
            label: "HTML",
        }
    ],

    requiredIntegrations: ["integration:Gmail"],

    signalIn: false,
    signalOut: "trigger",

    deletable: false,
    hideInBrowser: true,

    renderNode: () => {

        const alignHandle = useAlignHandles()

        return (
            <Group position="apart">
                <Center sx={{ flexGrow: 1 }}>
                    <ThemeIcon size="xl" variant="light" color="red">
                        <Mail />
                    </ThemeIcon>
                </Center>
                <Stack spacing={0} align="end">
                    <Text pb={8} size="xs" ref={alignHandle("fromName")}>From Name</Text>
                    <Text pb={8} size="xs" ref={alignHandle("fromEmail")}>From Email</Text>
                    <Text pb={8} size="xs" ref={alignHandle("subject")}>Subject</Text>
                    <Text pb={8} size="xs" ref={alignHandle("date")}>Date</Text>
                    <Text pb={8} size="xs" ref={alignHandle("plainText")}>Plain Text</Text>
                    <Text pb={8} size="xs" ref={alignHandle("html")}>HTML</Text>
                </Stack>
            </Group>
        )
    }
}