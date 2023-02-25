import { safeMap } from "../arrayUtilities.js"
import openaiApi from "./api.js"


export default {
    id: "openai:Parse",
    name: "Parse with GPT",

    inputs: ["text"],
    outputs: ["data"],

    async onInputsReady({ text }) {

        if (!this.state.dataLabels?.length)
            throw new Error("No outputs specified")

        // format data labels for prompt
        const formatter = new Intl.ListFormat("en")
        const formattedList = formatter.format(this.state.dataLabels)
        const formattedListQuotes = formatter.format(this.state.dataLabels.map(label => `"${label}"`))

        // construct prompt
        const prompt = text => `\`\`\`
${text.trim()}
\`\`\`
Here is the ${formattedList} from this text in JSON form with keys ${formattedListQuotes}. Nonexistent values are null.
`

        const result = await safeMap(async text => {
            // call API
            const resp = await openaiApi.createCompletion(prompt(text))

            // try to parse
            try {
                // GPT responds with weird stuff sometimes -- we're gonna try to pick out JSON
                return JSON.parse(
                    resp?.match(/{.+}/s)[0]
                )
            }
            catch (err) {
                throw new Error("Failed to parse text")
            }
        }, text)

        this.publish(
            Object.fromEntries(
                this.state.dataLabels.map(
                    (label, i) => [`data.${i}`, result.map(res => res[label])]
                )
            )
        )
    },
}