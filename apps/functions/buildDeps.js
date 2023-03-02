import fs from "fs/promises"
import path from "path"
import { exec as execCallback } from "child_process"
import { promisify } from "util"

const exec = promisify(execCallback)

const PackagesDir = "../../packages"
const LocalModulesDir = "./local_modules"

// check if we have an original package.json
try {
    await fs.stat("./package_original.json")
    console.log("Found original package.json. Clean the directory before trying again.")
    process.exit(1)
}
catch(err) {
    console.log()
}

// make local_modules folder
try {
    await fs.mkdir(LocalModulesDir)
    console.log("Created local_modules folder.")
}
catch (err) {
    console.log("local_modules exists. Continuing...")
}

// read in dependencies
const packageJson = JSON.parse(
    await fs.readFile("./package.json", "utf-8")
)

// find my local deps -- ones with "*"
const myDeps = Object.keys(packageJson.dependencies)
    .filter(packageName => packageJson.dependencies[packageName].includes("workspace:"))

console.log(`Preparing ${myDeps.length} dependencies...`)

// create map of package names -> package directories
const packageFolders = await fs.readdir(PackagesDir)

const packageMap = Object.fromEntries(
    await Promise.all(
        packageFolders.map(async folder => {

            const { name } = JSON.parse(
                await fs.readFile(
                    path.join(PackagesDir, folder, "package.json"),
                    "utf-8"
                )
            )

            return [name, path.join(PackagesDir, folder)]
        })
    )
)

// pack each of my deps and create a map of dep name -> packaged tarball name
const resultMap = Object.fromEntries(
    await Promise.all(
        myDeps.map(async dep => {
            const command = `pnpm pack --pack-destination "${path.join("../../apps/functions", LocalModulesDir)}"`
            const cwd = packageMap[dep]
            console.log(`\tPacking ${dep} from ${cwd}`)

            const { stdout } = await exec(command, {
                cwd,
            })

            return [dep, "file:.\\" + path.join(LocalModulesDir, path.basename(stdout.trim()))]
        })
    )
)
console.log("Done.")

// rename our old package.json to preserve it
await fs.rename("./package.json", "./package_original.json")
console.log("Preserved original package.json as package_original.json.")

// spread in our new dependencies
packageJson.dependencies = {
    ...packageJson.dependencies,
    ...resultMap,
}

// write new package.json
await fs.writeFile("./package.json", JSON.stringify(packageJson, null, 4))
console.log("Wrote out package.json.\nReady for deployment ✅")