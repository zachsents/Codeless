import { defineSecret, defineString } from "firebase-functions/params"
import createClient from "twilio"


const twilioAccountSID = defineString("TWILIO_ACCOUNT_SID", {
    description: "Twilio account SID. Can be found in the Twilio console.",
})

const twilioPhoneNumber = defineString("TWILIO_PHONE_NUMBER", {
    description: "Twilio phone number. Can be found in the Twilio console.",
})

export const twilioAuthToken = defineSecret("TWILIO_AUTH_TOKEN", {
    description: "Twilio auth token. Can be found in the Twilio console.",
})


function client() {
    return createClient(twilioAccountSID.value(), twilioAuthToken.value())
}


export function sendSMS({ to, body }) {
    return client().messages.create({
        to,
        body,
        from: twilioPhoneNumber.value(),
    })
}