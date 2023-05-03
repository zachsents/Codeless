import chalk from "chalk"
import fs from "fs/promises"


// remove local_modules folder
await fs.rm("./local_modules", {
    recursive: true,
    force: true,
})

console.log(chalk.gray("Removed local_modules folder."))

// check if we have an original package.json
try {
    await fs.stat("./package_original.json")
}
catch (err) {
    console.log(chalk.yellow("!") + chalk.gray(" No original package.json found. Functions is clean."))
    process.exit(0)
}

// remove temporary package.json
await fs.rm("./package.json")

// rename original package.json
await fs.rename("./package_original.json", "./package.json")

console.log(chalk.green("Cleaned!"))