import { AlphabetLatin } from "tabler-icons-react"
import { TargetArrow } from "tabler-icons-react"
import TextAreaControl from "../components/TextAreaControl"
import { Regex } from "tabler-icons-react"
import RegexControl from "../components/RegexControl"
import { Apps } from "tabler-icons-react"


export default {
    id: "text:Extract",
    name: "Extract",
    description: "Extracts text matching a pattern from text.",
    icon: TargetArrow,

    tags: ["Text"],

    inputs: [
        {
            id: "text",
            description: "The text to extract from.",
            tooltip: "The text to extract from.",
            icon: AlphabetLatin,
            allowedModes: ["handle", "config"],
            renderConfiguration: TextAreaControl,
        },
        {
            id: "pattern",
            description: "The pattern to extract.",
            tooltip: "The pattern to extract.",
            icon: Regex,
            allowedModes: ["handle", "config"],
            defaultMode: "config",
            renderConfiguration: RegexControl,
        },
    ],
    outputs: [
        {
            id: "result",
            name: "Extracted Text",
            description: "The extracted text.",
            tooltip: "The extracted text.",
            icon: TargetArrow,
        },
        {
            id: "groups",
            name: "Capture Groups",
            description: "The capture groups from the pattern.",
            tooltip: "The capture groups from the pattern.",
            icon: Apps,
            listMode: "unnamed",
            defaultShowing: false,
        },
    ],
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