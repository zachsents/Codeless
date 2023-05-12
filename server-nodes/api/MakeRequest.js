import fetch from "node-fetch"
import { safeMap } from "../arrayUtilities.js"
import { objectToSafeMapEntries } from "../arrayUtilities.js"


export default {
    id: "api:MakeRequest",

    inputs: ["url", "method", "query", "body", "responseType"],

    async onInputsReady({ url, method, query, body, responseType }) {

        const response = await safeMap(async (url, method, query, body, responseType) => {

            // Build URL
            const urlObj = new URL(url)

            // Add query params
            Object.entries(query).forEach(([key, value]) => {
                urlObj.searchParams.append(key, value)
            })

            // Determine body type
            let extraHeaders = {}
            try {
                JSON.parse(body)
                extraHeaders["Content-Type"] = "application/json"
            } catch (e) { /* empty */ }

            // Make request
            const resp = await fetch(urlObj, {
                method,
                body: method == "GET" ? undefined : body,
                headers: {
                    ...extraHeaders,
                },
            })

            // Parse response
            if (responseType == "text")
                return await resp.text()
            if (responseType == "json")
                return await resp.json()

            return resp

        }, url, method, objectToSafeMapEntries(query), body, responseType)


        this.publish({ response })
    },
}