import { safeMap } from "../arrayUtilities.js"
import openaiApi from "./api.js"


export default {
    id: "openai:Rate",
    name: "Rate with GPT",

    inputs: ["text"],
    outputs: ["rating"],

    async onInputsReady({ text }) {

        // validate params
        if (!this.state.property)
            throw new Error("Must provide a property")

        if (!this.state.scale)
            throw new Error("Must provide a scale")

        // construct prompt
        const prompt = text => `Here's some text:
\`\`\`
${text.trim()}
\`\`\`
Provide an accurate rating of the ${this.state.property} out of ${this.state.scale}.

`

        const rating = await safeMap(async text => {
            // call API
            const resp = await openaiApi.createCompletion(prompt(text))

            // parse out rating
            const result = parseFloat(resp?.match(/[\d.-]+/) ?? "")

            if(isNaN(result))
                throw new Error("Didn't produce a rating")
            
            return result
        }, text)

        this.publish({ rating })
    },
}