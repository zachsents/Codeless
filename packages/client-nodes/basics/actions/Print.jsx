import { Message } from "tabler-icons-react"
import { Terminal } from "tabler-icons-react"

/** 
 * @type {import("../DefaultTemplate.jsx").NodeTypeDefinition} 
 */
export default {
    id: "basic:Print",
    name: "Print",
    description: "Prints to console.",
    icon: Terminal,

    inputs: [
        {
            id: "_in",
            name: "Input",
            description: "The input to print.",
            tooltip: "The input to print.",
            icon: Message,
            allowedModes: ["config", "handle"],
        }
    ],
    outputs: [],
}