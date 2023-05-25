import { useCallback } from "react"
import { useQueries, useQuery } from "react-query"
import { createApp, createAppsForUserQuery, deleteApp, getAppDetails, getAppDetailsForUser, getAppRef, renameApp, updateApp } from "./app-actions.js"
import { useAuthState } from "./auth-hooks.js"
import { auth, functions } from "./firebase-init.js"
import { useRealtime } from "./firestore-util.js"
import { useCallbackWithRequirements } from "./util.js"
import { httpsCallable } from "firebase/functions"
import { objectToPaths, pathsToObject } from "@minus/util"
import _ from "lodash"


/**
 * Hook that queries app details.
 *
 * @export
 * @param {string} appId
 */
export function useAppDetails(appId) {

    const { data: app, ...result } = useQuery(
        ["app", appId],
        () => getAppDetails(appId)
    )

    return { app, ...result }
}


/**
 * Hook that provides a real-time updated state object containing
 * app details. 
 *
 * @export
 * @param {string} appId
 */
export function useAppDetailsRealtime(appId) {
    return useRealtime(getAppRef(appId))
}


/**
 * Hook that creates a callback that creates an app for the currently
 * logged in user.
 *
 * @export
 */
export function useCreateApp() {

    const { user } = useAuthState(auth)

    return useCallbackWithRequirements(
        name => createApp({
            name,
            ownerIds: [user.uid],
        }),
        [user]
    )
}


/**
 * Hook that creates a callback that renames an app.
 *
 * @export
 * @param {string} appId
 */
export function useRenameApp(appId) {
    return useCallback(
        newName => renameApp(appId, newName),
        [appId]
    )
}


/**
 * Hook that creates a callback that updates an app.
 *
 * @export
 * @param {string} appId
 */
export function useUpdateApp(appId) {
    return useCallback(
        changes => updateApp(appId, changes),
        [appId]
    )
}


/**
 * Hook that creates a callback that deletes an app.
 *
 * @export
 * @param {string} appId
 */
export function useDeleteApp(appId) {
    return useCallback(
        () => deleteApp(appId),
        [appId]
    )
}


/**
 * Hook that lists apps for a given user.
 *
 * @export
 * @param {string} userId
 */
export function useAppDetailsForUser(userId) {
    const { data: apps, ...result } = useQuery(
        ["appsForUser", userId],
        () => getAppDetailsForUser(userId)
    )

    return { apps, ...result }
}


/**
 * Hook that provides a real-time list of apps for a given user.
 *
 * @export
 * @param {string} userId
 */
export function useAppDetailsForUserRealtime(userId) {
    return useRealtime(createAppsForUserQuery(userId))
}


/**
 * Hook that queries the integration status of the app's connected
 * integrations.
 *
 * @export
 * @param {object} app
 * @param {object} integrations
 */
export function useAppIntegrations(app, integrations) {

    const accountsObj = app?.integrations ?? {}

    // Format as list of paths 
    const accountPaths = objectToPaths(accountsObj)
    const fullAccountPaths = accountPaths.map(path => [path[0], _.get(accountsObj, path)])

    // Create a query for account
    const queries = fullAccountPaths.map(([integrationId, accountId]) => ({
        queryKey: ["integration-account", accountId],
        queryFn: () => {
            return false

            // const authFunc = integrations[integrationId].authorizationFunction

            // // If auth function is a string, use it as a callable function
            // if (typeof authFunc === "string")
            //     return httpsCallable(functions, authFunc)({ accountId }).then(res => res.data)

            // // Otherwise, assume it's a function that returns a promise
            // return authFunc({ accountId })
        },
    }))

    // Run the queries
    const results = useQueries(queries)

    // Put back in an object of the original shape
    return pathsToObject(fullAccountPaths, results)
}