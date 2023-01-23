import { authorizeOpenAIAPI } from "./auth.js"


export default {
    id: "openai:AskGPT3",
    name: "Ask ChatGPT",

    inputs: ["$prompt"],
    outputs: ["response"],

    async onInputsReady({ $prompt }) {

        const openaiApi = authorizeOpenAIAPI()

        const response = await openaiApi.createCompletion({
            model: this.state.model,
            prompt: $prompt,
            temperature: 0,
            max_tokens: 100,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            // stop: ["\n"],
        })

        this.publish({ response: response.data.choices[0].text })
    },
}