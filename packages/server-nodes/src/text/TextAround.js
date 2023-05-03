import { safeRegex } from "@minus/server-sdk"
import { safeMap } from "../arrayUtilities.js"


export default {
    id: "text:TextAround",

    inputs: ["text", "target", "reach", "onlyFirst"],

    onInputsReady({ text, target, reach, onlyFirst }) {
        this.publish({
            result: safeMap((text, target, reach, onlyFirst) => {

                // if target is a string, use it as RegExp source
                const { source, flags } = typeof target === "string" ?
                    { source: target, flags: "" } :
                    safeRegex(target)

                // we only need global flag if we're matching all
                const requiredFlags = onlyFirst ? "is" : "gis"

                // build the regex -- add required flags
                const regex = new RegExp(
                    `.{0,${reach}}(?:${source}).{0,${reach}}`,
                    [...new Set([...(requiredFlags + flags)])].join("")
                )

                return regex.global ?
                    (text.match(regex) ?? []) :
                    text.match(regex)?.[0]

            }, text, target, reach, onlyFirst)
        })
    }
}
