import { ArrayMode } from "@minus/gee3"


const factors = {
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
}


export default {
    id: "basic:RelativeDateTime",

    inputs: [
        {
            name: "time",
            arrayMode: ArrayMode.FlatSingle,
        }
    ],

    onInputsReady({ time }) {

        if (!time?.interval || !time?.unit)
            throw new Error("Must include an interval and a unit")

        this.publish({
            $: new Date(Date.now() + time.interval * factors[time.unit])
        })
    },
}