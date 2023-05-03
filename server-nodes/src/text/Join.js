import { safeMap } from "../arrayUtilities.js"


export default {
    id: "text:Join",

    inputs: ["text", "mode", "join"],

    async onInputsReady({ text, mode, join }) {
        this.publish({
            joinedText: safeMap((mode, join, ...text) => {

                if (mode == "custom")
                    return text.join(join)

                const formatter = new Intl.ListFormat("en", {
                    style: "long",
                    type: mode,
                })
                return formatter.format(text)

            }, mode, join, ...text)
        })
    },
}