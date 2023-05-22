import { safeRegex } from "@minus/server-lib"

export default {
    id: "text:Regex",

    inputs: ["$pattern"],

    onInputsReady({ $pattern }) {
        this.publish({
            $: safeRegex($pattern),
        })
    },
}