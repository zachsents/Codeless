import { safeMap } from "../arrayUtilities.js"
import openaiApi from "./api.js"


export default {
    id: "openai:AskGPT3",
    name: "Ask ChatGPT",

    inputs: ["prompt"],
    outputs: ["response"],

    async onInputsReady({ prompt }) {

        const response = await safeMap(
            prompt => openaiApi.createChatCompletion(prompt, { 
                temperature: this.state.temperature,
            }),
            prompt
        )

        this.publish({ response })
    },
}