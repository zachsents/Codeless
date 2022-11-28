import { useEffect } from "react"
import { TextInput } from "@mantine/core"
import { Mailbox } from "tabler-icons-react"

export default {
    name: "Test Mail",
    description: "Sends a test email with fixed content.",
    icon: Mailbox,
    signalTargets: [" "],
    valueTargets: ["to"],

    expanded: ({ state, setState, connections }) => {

        useEffect(() => {
            connections.to && setState({ to: null })
        }, [connections.to])

        return <TextInput
            disabled={connections.to}
            label="Recipient"
            size="xs"
            value={state.to ?? ""}
            onChange={event => setState({ to: event.currentTarget.value })}
            placeholder="zach@nocode.com"
        />
    }
}