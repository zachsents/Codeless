const fs = require("fs/promises")

const FirebaseConfigPath = "../firebase.json"

async function configureRoutes() {
    // read in dynamic routes from manifest
    const { dynamicRoutes } = JSON.parse(
        await fs.readFile("./.next/routes-manifest.json", "utf-8")
    )

    console.log("Adding", dynamicRoutes.length, "dynamic routes...")

    // read in firebase config
    const firebaseConfig = JSON.parse(
        await fs.readFile(FirebaseConfigPath, "utf-8")
    )

    // take note of existing routes
    const existingRoutes = firebaseConfig.hosting.rewrites.map(route => route.regex)

    // add dynamic routes to hosting rewrites
    firebaseConfig.hosting.rewrites.push(
        ...dynamicRoutes
            // filter out existing ones
            .filter(route => !existingRoutes.includes(route.regex))
            // map to firebase format
            .map(route => ({
                regex: route.regex,
                destination: `${route.page}.html`,
            }))
    )

    // write out modified config
    await fs.writeFile(FirebaseConfigPath, JSON.stringify(firebaseConfig, null, 4))

    console.log("Done.\nReady for deployment ✅")
}

configureRoutes()