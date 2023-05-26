import { safeMap } from "../arrayUtilities.js"
import { openai } from "@minus/server-lib"


export default {
    id: "openai:Rate",

    inputs: ["text", "property", "scale"],

    async onInputsReady({ text, property, scale }) {

        // validate params
        if (!property || !property.length)
            throw new Error("Must provide a property")

        if (!scale || !scale.length)
            throw new Error("Must provide a scale")


        this.publish({
            result: await safeMap(async (text, property, scale) => {
                // call API
                const resp = await openai.createCompletion(
                    createPrompt(text, property, scale)
                )

                // parse out rating
                const result = parseFloat(resp?.match(/[\d.-]+/) ?? "")

                if (isNaN(result))
                    throw new Error("Didn't produce a rating")

                return result
            }, text, property, scale)
        })
    },
}


function createPrompt(text, property, scale) {
    return `Here's some text:
\`\`\`
${text.trim()}
\`\`\`
Provide an accurate rating of the ${property} out of ${scale}.

`
}