import fs from "fs/promises"


// remove local_modules folder
await fs.rm("./local_modules", { 
    recursive: true, 
    force: true,
})

// check if we have an original package.json
try {
    await fs.stat("./package_original.json")
}
catch(err) {
    console.log("No preserved package.json. Quitting.")
    process.exit(0)
}

// remove temporary package.json
await fs.rm("./package.json")

// rename original package.json
await fs.rename("./package_original.json", "./package.json")