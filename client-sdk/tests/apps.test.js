import { passOrFail, TestSeries, testTitle } from "./test-utils.js"
import { initializeFirebase } from "../firebase-init.js"


import * as dotenv from "dotenv"
import { createApp, deleteApp, getAppDetails, getAppDetailsForUser } from "../app-actions.js"
import chalk from "chalk"
dotenv.config({ path: "./.env.local" })

testTitle("Apps Test")

// sus polyfill window
global.window ??= global

// init firebase
initializeFirebase(process.env.FIREBASE_API_KEY, {
    analytics: false,
})

const series = new TestSeries()


await series.try(
    "Get Existing App",
    async () => {
        const { id, name, description } = await getAppDetails("uk9NyprElZgmSCFoyXoK")
        return id && `${chalk.bold.blue(name)} ${chalk.blue(id)}\n${chalk.gray(description)}`
    },
    {
        shouldBeTruthy: true,
        logResult: true,
    }
)


const newAppId = await series.try(
    "Create App",
    async () => {
        const ref = await createApp({ 
            name: "Test App 12345",
            ownerIds: ["xxx"],
        })
        return ref.id
    },
    {
        shouldBeTruthy: true,
        logResult: x => chalk.green(`App created: ${x}`),
    }
)


await series.try(
    "Get Newly Created App",
    async () => {
        const { id, name, created } = await getAppDetails(newAppId)
        return `${chalk.bold.blue(name)} ${chalk.blue(id)}\n${createdOn(created)}`
    },
    {
        shouldBeTruthy: true,
        logResult: true,
    }
)


await series.try(
    "Delete App",
    async () => {
        await deleteApp(newAppId)
        return `Deleted app: ${newAppId}`
    },
    {
        shouldBeTruthy: true,
        logResult: chalk.red,
    }
)


await series.try(
    "Query Apps for User",
    async () => {
        const apps = await getAppDetailsForUser("icJDPVNXLxR35dHLPtgmR2bF6Lg2")
        return apps.map(app => `${chalk.bold.blue(app.name)} ${chalk.blue(app.id)}`).join("\n")
    },
    {
        shouldBeTruthy: true,
        logResult: true,
    }
)


series.eval()
process.exit(0)


function createdOn(timestamp) {
    return chalk.gray("Created on " + new Date(timestamp.seconds * 1000).toLocaleString())
}