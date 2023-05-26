import { safeMap } from "@minus/util"
import { twilio } from "@minus/server-lib"


export default {
    id: "twilio:SendSMS",

    inputs: ["to", "body"],

    async onInputsReady({ to, body }) {

        await safeMap({
            concurrency: 10,
            max: 100,
        }, (to, body) => twilio.sendSMS({ to, body }), to, body)
    },
}