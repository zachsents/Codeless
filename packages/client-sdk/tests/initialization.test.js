import chalk from "chalk"
import { initializeFirebase, firestore } from "../firebase-init.js"
import { passOrFail, testTitle } from "./test-utils.js"

import * as dotenv from "dotenv"
dotenv.config({ path: "./.env.local" })

testTitle("Firebase Initialization Test")

// sus polyfill window
global.window ??= global

console.log(chalk.blue("Before init:"), typeof firestore)
initializeFirebase(process.env.FIREBASE_API_KEY, {
    analytics: false,
})

const cond = typeof firestore === "object"
console.log(
    chalk.blue("After init:"),
    chalk[cond ? "green" : "red"](typeof firestore)
)

passOrFail(cond)