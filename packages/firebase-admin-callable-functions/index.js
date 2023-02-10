import fetch from "node-fetch"

const DEFAULT_REGION = "us-central1"

const DEFAULT_LOCAL = {
    HOSTNAME: "localhost",
    PORT: 5001,
}

export function httpsCallable(url) {
    return async (data = {}) => {
        return await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${""}`
            },
            body: JSON.stringify({ data })
        })
    }
}

export function url(functionName, {
    projectId = global.admin?.app().options.projectId ?? null,
    region = DEFAULT_REGION,
    local = process.env.FUNCTIONS_EMULATOR ?? false,
    hostname = DEFAULT_LOCAL.HOSTNAME,
    port = DEFAULT_LOCAL.PORT,
} = {}) {
    return local ?
        `http://${hostname}:${port}/${projectId}/${region}/${functionName}` :
        `https://${region}-${projectId}.cloudfunctions.net/${functionName}`
}