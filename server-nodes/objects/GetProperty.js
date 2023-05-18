import { safeMap } from "../arrayUtilities.js"


export default {
    id: "objects:GetProperty",

    inputs: ["object", "property"],

    onInputsReady({ object, property }) {
        this.publish({
            value: safeMap(
                (object, property) => findKeyInObject(object, property),
                object, property
            ),
        })
    },
}

function findKeyInObject(obj, key) {
    if (Object.prototype.hasOwnProperty.call(obj, key))
        return obj[key]

    // otherwise, look for case insensitive match
    return Object.entries(obj).find(([k]) => k.toLowerCase() == key.toLowerCase())?.[1]
}