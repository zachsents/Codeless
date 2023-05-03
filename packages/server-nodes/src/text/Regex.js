import { safeRegex } from "@minus/server-sdk"

export default {
    id: "text:Regex",

    inputs: ["$pattern"],

    onInputsReady({ $pattern }) {
        this.publish({
            $: safeRegex($pattern),
        })
    },
}