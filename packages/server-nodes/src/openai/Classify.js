import { safeMap } from "../arrayUtilities.js"
import openaiApi from "./api.js"


export default {
    id: "openai:Classify",
    name: "Classify with GPT",

    inputs: ["text"],
    outputs: ["classification"],

    async onInputsReady({ text }) {

        // validate params
        if (!this.state.categories?.length)
            throw new Error("Include at least 1 category")

        const categories = this.state.categories.map(cat => cat.value)

        // construct prompt
        const prompt = text => `Here's some text:
\`\`\`
${text.trim()}
\`\`\`
Which category (${categories.join(", ")}) best describes the text?
Answer:`

        const classification = await safeMap(async text => {
            // call API
            const resp = await openaiApi.createCompletion(prompt(text))

            // test response for categories case insensitively and return exact user input
            return categories.find(cat => new RegExp(cat, "i").test(resp))
        }, text)

        this.publish({ classification })
    },
}