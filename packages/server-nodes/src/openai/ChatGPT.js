import { safeMap } from "../arrayUtilities.js"
import openaiApi from "./api.js"


export default {
    id: "openai:ChatGPT",

    inputs: ["prompt", "temperature"],

    async onInputsReady({ prompt, temperature }) {

        const response = await safeMap(
            (prompt, temperature) => openaiApi.createChatCompletion(prompt, {
                temperature,
            }),
            prompt, temperature
        )

        this.publish({ response })
    },
}