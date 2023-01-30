import { TextDecrease } from "tabler-icons-react"


export default {
    id: "text:Remove",
    name: "Text Remove",
    description: "Replace in text.",
    icon: TextDecrease,
    badge: "Text",

    inputs: [
        "inputText",
        {
            name: "remove",
            label: "Remove This (Text or Regex)"
        },
    ],
    outputs: ["outputText"],
}