import { safeMap } from "../arrayUtilities.js"


export default {
    id: "basic:FormatDateTime",

    inputs: ["date", "type"],

    onInputsReady({ date, type }) {
        this.publish({
            formatted: safeMap((date, type) => {
                const dateObj = date instanceof Date ? date : new Date(date)

                if (type == "date")
                    return dateObj.toLocaleDateString()

                if (type == "time")
                    return dateObj.toLocaleTimeString()

                if (type == "both")
                    return dateObj.toLocaleString()
            }, date, type)
        })
    },
}