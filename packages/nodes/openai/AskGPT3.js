import { safeMap } from "../arrayUtilities.js"
import { authorizeOpenAIAPI } from "./auth.js"


export default {
    id: "openai:AskGPT3",
    name: "Ask ChatGPT",

    inputs: ["prompt"],
    outputs: ["response"],

    async onInputsReady({ prompt }) {

        const openaiApi = authorizeOpenAIAPI()
        const model = this.state.model

        const response = await Promise.all(
            safeMap(
                async currentPrompt => {
                    const resp = await openaiApi.createCompletion({
                        model,
                        prompt: currentPrompt,
                        temperature: 0,
                        max_tokens: 300,
                        frequency_penalty: 0.0,
                        presence_penalty: 0.0,
                        // stop: ["\n"],
                    })
                    return resp.data.choices[0].text
                },
                prompt
            )
        )

        this.publish({ response })
    },
}