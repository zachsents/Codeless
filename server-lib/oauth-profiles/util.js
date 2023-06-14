import path from "path"
import fs from "fs/promises"
import { fileURLToPath } from "url"


/**
 * Loads an OAuth profile from a JSON file in the same directory as this module.
 *
 * @export
 * @param {string} baseName
 * @param {object} [options]
 * @param {boolean} [options.differentLocal] - Use a different local file instead of live file
 * @return {Promise<object>}
 */
export async function loadProfile(baseName, {
    differentLocal = false,
} = {}) {

    const detailsPath = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        // use different file for local vs. live
        `./${baseName}${(process.env.FUNCTIONS_EMULATOR && differentLocal) ? ".local" : ""}.json`
    )

    return JSON.parse(await fs.readFile(detailsPath, "utf-8"))
}