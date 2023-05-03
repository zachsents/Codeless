import chalk from "chalk"
import { initializeFirebase } from "../firebase-init.js"
import { passOrFail, testTitle } from "./test-utils.js"

import * as dotenv from "dotenv"
import { sendEmailSignInLink } from "../auth.js"
dotenv.config({ path: "./.env.local" })

testTitle("Email Sign-In Test")

// sus polyfill window
global.window ??= global
window.location ??= {
    href: ""
}

// init firebase
initializeFirebase(process.env.FIREBASE_API_KEY, {
    analytics: false,
})

let success = true

try {
    // send sign-in link
    const email = "zachsents@gmail.com"
    console.log(`Sending sign-in link to ${email}...`)
    await sendEmailSignInLink("zachsents@gmail.com")
    console.log(chalk.green("Sent."))
}
catch (err) {
    success = false
    console.error(err)
}

passOrFail(success)