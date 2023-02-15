import { Center, Group, Stack, Text, ThemeIcon } from "@mantine/core"
import { Mail, Mailbox } from "tabler-icons-react"


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

    renderNode: ({ alignHandles }) => {

        return (
            <Group position="apart">
                <Center sx={{ flexGrow: 1 }}>
                    <ThemeIcon size="xl" variant="light" color="red">
                        <Mail />
                    </ThemeIcon>
                </Center>
                <Stack spacing={0} align="end">
                    <Text pb={8} size="xs" ref={el => alignHandles("fromName", el)}>From Name</Text>
                    <Text pb={8} size="xs" ref={el => alignHandles("fromEmail", el)}>From Email</Text>
                    <Text pb={8} size="xs" ref={el => alignHandles("subject", el)}>Subject</Text>
                    <Text pb={8} size="xs" ref={el => alignHandles("date", el)}>Date</Text>
                    <Text pb={8} size="xs" ref={el => alignHandles("plainText", el)}>Plain Text</Text>
                    <Text pb={8} size="xs" ref={el => alignHandles("html", el)}>HTML</Text>
                </Stack>
            </Group>
        )
    }
}