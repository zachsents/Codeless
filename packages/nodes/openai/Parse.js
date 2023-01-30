import { safeMap } from "../arrayUtilities.js"
import { authorizeOpenAIAPI } from "./auth.js"


export default {
    id: "openai:Parse",
    name: "Parse with GPT",

    inputs: ["text"],
    outputs: ["data"],

    async onInputsReady({ text }) {

        const openaiApi = authorizeOpenAIAPI()

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
                    const resp = await openaiApi.createCompletion({
                        model: "text-davinci-003",
                        prompt: prompt(text),
                        temperature: 0,
                        max_tokens: 300,
                        frequency_penalty: 0.0,
                        presence_penalty: 0.0,
                    })

                    // try to parse
                    try {
                        return JSON.parse(resp.data.choices[0].text)
                    }
                    catch (err) {
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