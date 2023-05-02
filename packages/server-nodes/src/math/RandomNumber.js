import { safeMap } from "../arrayUtilities.js"


export default {
    id: "math:RandomNumber",

    inputs: ["min", "max", "integer"],

    onInputsReady({ min, max, integer }) {
        this.publish({
            $: safeMap((min, max, integer) => {
                const rand = Math.random() * (max + (integer ? 1 : 0) - min) + min
                return integer ? Math.floor(rand) : rand
            }, min, max, integer),
        })
    },
}