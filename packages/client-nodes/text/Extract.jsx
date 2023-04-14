import { TargetArrow } from "tabler-icons-react"


export default {
    id: "text:Extract",
    name: "Extract Text",
    description: "Extracts text matching a pattern from text.",
    icon: TargetArrow,
    tags: ["text"],

    inputs: ["text", "pattern"],
    outputs: ["extracted"],
}

/** 
 * TO DO:
 * 
 * Add a list handle for output based on how many capture groups
 * are in the Regex. This is useful for counting them: /(?<!\\)\((?!\?)/g
 * 
 * In order to achieve this, we'll need to give access to the connected
 * nodes states.
 */