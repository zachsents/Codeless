import { passOrFail, TestSeries, testTitle } from "./test-utils.js"
import { initializeFirebase } from "../firebase-init.js"
import { getPlan, getPlanRef } from "../plans.js"


import * as dotenv from "dotenv"
dotenv.config({ path: "./.env.local" })

testTitle("Plans Test")

// sus polyfill window
global.window ??= global

// init firebase
initializeFirebase(process.env.FIREBASE_API_KEY, {
    analytics: false,
})

const series = new TestSeries()

await series.try(
    "Get Plan By Ref",
    () => getPlan({ ref: getPlanRef("free") }),
    {
        shouldBeTruthy: true,
        logResult: true,
    }
)

await series.try(
    "Get Plan By Name",
    () => getPlan({ name: "basic" }),
    {
        shouldBeTruthy: true,
        logResult: true,
    }
)

series.eval()
process.exit(0)