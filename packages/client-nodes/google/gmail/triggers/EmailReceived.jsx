import { Center, Group, Stack, Text, ThemeIcon, Tooltip } from "@mantine/core"
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
        "fromName", "fromEmail", "subject", "date", "plainText", "simpleText", {
            name: "html",
            label: "HTML",
        }
    ],

    requiredIntegrations: ["integration:Gmail"],

    creatable: false,
    trigger: true,
    deletable: false,

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
                    <Tooltip openDelay={500} multiline maw={300} withinPortal
                        label="A trimmed down version of the raw plain text meant to be more useful to work with.">
                        <Text pb={8} size="xs" ref={el => alignHandles("simpleText", el)}>Simple Text</Text>
                    </Tooltip>
                    <Text pb={8} size="xs" ref={el => alignHandles("plainText", el)}>Raw Plain Text</Text>
                    <Text pb={8} size="xs" ref={el => alignHandles("html", el)}>Raw HTML</Text>
                </Stack>
            </Group>
        )
    }
}