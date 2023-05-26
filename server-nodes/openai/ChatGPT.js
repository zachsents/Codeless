import { safeMap } from "../arrayUtilities.js"
import { openai } from "@minus/server-lib"


export default {
    id: "openai:ChatGPT",

    inputs: ["prompt", "temperature"],

    async onInputsReady({ prompt, temperature }) {

        const response = await safeMap(
            (prompt, temperature) => openai.createChatCompletion(prompt, {
                temperature,
            }),
            prompt, temperature
        )

        this.publish({ response })
    },
}