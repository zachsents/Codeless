import { Textarea } from "@mantine/core"
import { AlphabetLatin } from "tabler-icons-react"
import { useInternalState } from "../hooks/nodes.js"


/**
 * @type {import("../DefaultTemplate.jsx").NodeTypeDefinition}
 */
export default {
    id: "basic:Text",
    name: "Text",
    description: "Just a plain ol' text.",
    icon: AlphabetLatin,
    badge: "Text",

    inputs: [],
    outputs: ["$"],

    defaultState: {
        $: "",
    },

    renderCard: false,
    renderName: false,

    renderContent: () => {
        const [state, setState] = useInternalState()
        return <Textarea
            value={state.$ ?? ""}
            onChange={event => setState({ $: event.currentTarget.value })}
            placeholder="Type something..."
            radius="md"
            size="xs"
            autosize
            minRows={1}
            maxRows={15}
            w={200}
        />
    },
}
