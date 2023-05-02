import { safeMap } from "../arrayUtilities.js"


export default {
    id: "objects:GetProperty",

    inputs: ["object", "property"],

    onInputsReady({ object, property }) {
        this.publish({
            value: safeMap(
                (object, property) => object[property],
                object, property
            ),
        })
    },
}