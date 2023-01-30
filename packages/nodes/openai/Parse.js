import { safeMap } from "../arrayUtilities.js"
import openaiApi from "./api.js"


export default {
    id: "openai:Parse",
    name: "Parse with GPT",

    inputs: ["text"],
    outputs: ["data"],

    async onInputsReady({ text }) {

        // format data labels for prompt
        const formatter = new Intl.ListFormat("en")
        const formattedList = formatter.format(this.state.dataLabels)
        const formattedListQuotes = formatter.format(this.state.dataLabels.map(label => `"${label}"`))

        // construct prompt
        const prompt = text => `Parse out the ${formattedList} from this text in JSON form with keys ${formattedListQuotes}:\n\n${text}`

        const result = await Promise.all(
            safeMap(
                async text => {
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
                        console.debug(`Unable to parse GPT response as JSON:\n${resp.data.choices[0].text}`)
                        return {}
                    }
                },
                text
            )
        )

        this.publish(
            Object.fromEntries(
                this.state.dataLabels.map(
                    (label, i) => [`data.${i}`, result.map(res => res[label])]
                )
            )
        )
    },
}