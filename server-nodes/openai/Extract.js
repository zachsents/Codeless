import { safeMap } from "../arrayUtilities.js"
import { openai } from "@minus/server-lib"


export default {
    id: "openai:Extract",

    inputs: ["text", "target"],

    async onInputsReady({ text, target }) {

        if (!target || !target.length)
            throw new Error("Must provide a target")

        this.publish({
            result: await safeMap(async (text, target) => {
                // call API
                const resp = await openai.createCompletion(
                    createPrompt(text, target)
                )

                // try to parse
                try {
                    // GPT responds with weird stuff sometimes -- we're gonna try to pick out JSON
                    const parsed = JSON.parse(
                        resp?.match(/{.+}/s)[0]
                    )

                    // property name should be target, but fallback to first value
                    return parsed[target] ?? Object.values(parsed)[0]
                }
                catch (err) {
                    throw new Error("Failed to parse text")
                }
            }, text, target)
        })
    },
}


function createPrompt(text, target) {
    return `\`\`\`
${text.trim()}
\`\`\`
Here is the ${target} extracted from this text in JSON form with key "${target}". Nonexistent values are null.
`
}