import { safeRegex } from "@minus/server-lib"
import { safeMap } from "../arrayUtilities.js"
import _ from "lodash"


export default {
    id: "text:Extract",

    inputs: ["text", "pattern"],

    onInputsReady({ text, pattern }) {

        const matches = safeMap(
            (text, _pattern) => {
                const pattern = safeRegex(_pattern)

                if (pattern.global)
                    return _.zip(...text.matchAll(pattern))

                return text.match(pattern)
            },
            text, pattern
        )

        const [result, ...groups] = _.zip(...matches)

        this.publish({
            result,
            groups,
        })
    },
}
