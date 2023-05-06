import fs from "fs/promises"
import path from "path"


// #region - Main Script

const nodes = await findNodes(".")
nodes.forEach(renameDuplicate)

const barrel = nodes.map(node => `import ${node.name} from "./${node.path.replaceAll("\\", "/")}"`).join("\n") + `

export default [
    ${nodes.map(node => node.name).join(",\n    ")}
]`

await fs.writeFile("./nodes-barrel.js", barrel)

console.log(`Created barrel for ${nodes.length} nodes. (nodes-barrel.js)`)

// #endregion


/**
 * @typedef NodeFile
 * @property {string} name
 * @property {string} package
 * @property {string} path
 */


/**
 * Recursively renames a node until it is no longer a duplicate.
 *
 * @param {NodeFile[]} nodes
 * @param {NodeFile} node
 */
function renameDuplicate(node) {
    const isDuplicate = nodes.filter(n => n.name === node.name).length > 1

    if (!isDuplicate)
        return

    if (node.name.startsWith(node.package)) {
        node.name += "2"
        renameDuplicate(node)
        return
    }

    node.name = node.package + node.name
}


/**
 * Recursively finds all nodes in a directory. Nodes are JSX files 
 * ending in .node.jsx.
 * 
 * @async
 * @param {string} dir
 * @return {Promise<NodeFile[]>}
 */
async function findNodes(dir) {
    // read all files & directories
    const entries = await fs.readdir(dir, {
        withFileTypes: true,
    })

    // find all nodes
    const nodes = await Promise.all(
        entries.filter(entry => entry.isFile() && entry.name.endsWith(".node.jsx"))
            .map(async entry => {
                const filePath = path.join(dir, entry.name)

                // read id from file
                const fileContents = await fs.readFile(filePath, "utf-8")
                const [, packageName, varName] = fileContents.match(/id:\s*["'](\w+):(\w+)["']/) ?? []

                if (!varName)
                    return console.warn(`Node file at "${filePath}" does not have an id.`)

                return {
                    name: varName,
                    package: packageName.slice(0, 1).toUpperCase() + packageName.slice(1),
                    path: filePath,
                }
            })
    )

    // recurse directories
    const moreNodes = await Promise.all(
        entries.filter(entry => entry.isDirectory())
            .map(entry => findNodes(path.join(dir, entry.name)))
    )

    return [...nodes, ...moreNodes.flat()]
}
