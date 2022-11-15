import { BasicValueSource } from "./commonHandles.js"

export default {
    Number: {
        id: "Number",
        name: "Number",
        description: "Beep boop. Just a number.",
        categories: ["Primitive"],
        sources: {
            values: {
                " ": BasicValueSource()
            }
        }
    },
    Text: {
        id: "Text",
        name: "Text",
        description: "Just good ol' fashioned text.",
        categories: ["Primitive"],
        sources: {
            values: {
                " ": BasicValueSource()
            }
        }
    }
}