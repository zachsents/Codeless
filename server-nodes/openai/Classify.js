import { ArrayMode } from "@minus/gee3"
import { safeMap } from "../arrayUtilities.js"
import { openai } from "@minus/server-lib"


export default {
    id: "openai:Classify",

    inputs: [
        "text",
        {
            name: "categories",
            arrayMode: ArrayMode.FlatSingle,
        },
    ],

    async onInputsReady({ text, categories }) {

        // validate params
        if (!categories?.length)
            throw new Error("Include at least 1 category")

        this.publish({
            category: await safeMap(async text => {
                // call API
                const resp = await openai.createCompletion(
                    createPrompt(text, categories)
                )

                // test response for categories case insensitively and return exact user input
                return categories.find(cat => new RegExp(cat, "i").test(resp))
            }, text)
        })
    },
}


function createPrompt(text, categories) {
    return `Here's some text:
\`\`\`
${text.trim()}
\`\`\`
Which category (${categories.join(", ")}) best describes the text?
Answer:`
}