import glob from "glob"

const loadMessage = "[Server Nodes] Loaded server node definitions"

global.db = {
    collection: () => {}
}

export async function loadNodeDefinitions() {
    console.time(loadMessage)
    const definitions = {}

    // glob node definition files
    const jsfiles = await glob('**/*.js', {
        ignore: {
            ignored: p => {
                return !/^[A-Z]/.test(p.name)
            }
        },
        cwd: new URL("./", import.meta.url).toString(),
    })

    // import them all and add to definitions map
    await Promise.all(
        jsfiles.map(async file => {
            const defModule = await import(new URL(`.\\${file}`, import.meta.url))
            definitions[defModule.default.id] = defModule.default
        })
    )

    console.timeEnd(loadMessage)
    return definitions
}

export default loadNodeDefinitions