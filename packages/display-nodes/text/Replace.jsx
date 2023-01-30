import { Replace } from "tabler-icons-react"


export default {
    id: "text:Replace",
    name: "Text Replace",
    description: "Replace in text.",
    icon: Replace,
    badge: "Text",

    inputs: [
        "inputText",
        {
            name: "replace",
            label: "Replace This (Text or Regex)"
        },
        "replaceWith"
    ],
    outputs: ["outputText"],
}