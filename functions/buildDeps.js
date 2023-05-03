import fs from "fs/promises"
import path from "path"
import { exec as execCallback } from "child_process"
import { promisify } from "util"
import chalk from "chalk"

const exec = promisify(execCallback)

const PackagesDir = "../"
const LocalModulesDir = "./local_modules"
const FunctionsPathFromPakcage = "../functions"


// check if we have an original package.json
try {
    await fs.stat("./package_original.json")
    console.log(`${chalk.red("!!")} Found original package.json. Clean the directory before trying again.`)
    process.exit(1)
}
catch (err) {
    console.log()
}

// make local_modules folder
try {
    await fs.mkdir(LocalModulesDir)
    console.log(chalk.gray("Created local_modules folder."))
}
catch (err) {
    console.log(`${chalk.yellow("!")} ${chalk.gray("local_modules exists. Continuing...")}`)
}

// read in dependencies
const packageJson = JSON.parse(
    await fs.readFile("./package.json", "utf-8")
)

// find my local deps -- ones with "workspace:"
const myDeps = Object.keys(packageJson.dependencies)
    .filter(packageName => packageJson.dependencies[packageName].includes("workspace:"))

console.log(`Preparing ${chalk.cyan(myDeps.length)} dependencies...`)

// loop through each of my deps
const resultMap = Object.fromEntries(await Promise.all(
    myDeps.map(async depName => {
        // find the folder for this dependency
        const depFolder = (await Promise.all(
            (await fs.readdir(PackagesDir))
                .map(async dirName => {
                    try {
                        const { name } = JSON.parse(await fs.readFile(
                            path.join(PackagesDir, dirName, "package.json"),
                            "utf-8"
                        ))

                        return [dirName, name == depName]
                    }
                    catch (err) {
                        console.debug(chalk.gray(`Not a package. Skipping ${dirName}`))
                        return [dirName, false]
                    }
                })
        )).find(([, isMatch]) => isMatch)?.[0]

        // if we didn't find a folder, error out
        if (!depFolder) {
            console.log(`${chalk.red("!!")} Could not find package folder for ${depName}.`)
            process.exit(1)
        }

        // pack this dependency
        const command = `pnpm pack --pack-destination "${path.join(FunctionsPathFromPakcage, LocalModulesDir)}"`
        const cwd = path.join(PackagesDir, depFolder)
        console.log(`Packing ${chalk.cyan(depName)} from ${chalk.cyan(cwd)}`)
        const { stdout } = await exec(command, { cwd })

        // return entry of dep name -> packaged tarball location
        return [depName, "file:.\\" + path.join(LocalModulesDir, path.basename(stdout.trim()))]
    })
))

console.log(chalk.green("Done packing."))

// rename our old package.json to preserve it
await fs.rename("./package.json", "./package_original.json")
console.log(chalk.gray("Preserved original package.json as package_original.json."))

// spread in our new dependencies
packageJson.dependencies = {
    ...packageJson.dependencies,
    ...resultMap,
}

// write new package.json
await fs.writeFile("./package.json", JSON.stringify(packageJson, null, 4))
console.log(`${chalk.gray("Wrote out package.json.")} ${chalk.green("Ready for deployment!")}`)