import { safeMap } from "../arrayUtilities.js"
import openaiApi from "./api.js"


export default {
    id: "openai:AskGPT3",
    name: "Ask ChatGPT",

    inputs: ["prompt"],
    outputs: ["response"],

    async onInputsReady({ prompt }) {

        const response = await Promise.all(
            safeMap(
                prompt => openaiApi.createCompletion(prompt, { model: this.state.model }),
                prompt
            )
        )

        this.publish({ response })
    },
}