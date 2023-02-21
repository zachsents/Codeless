import { useCallback } from "react"
import { useQueries, useQuery } from "react-query"
import { createApp, createAppsForUserQuery, deleteApp, getAppDetails, getAppDetailsForUser, getAppRef, renameApp, updateApp } from "./app-actions.js"
import { useAuthState } from "./auth-hooks.js"
import { auth } from "./firebase-init.js"
import { useRealtime } from "./firestore-util.js"
import { useCallbackWithRequirements } from "./util.js"


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

    const user = useAuthState(auth)

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
    const intList = Object.values(integrations)

    const intIds = []
    const queries = app && Object.keys(app.integrations ?? {}).flatMap(integrationKey => {
        return intList.filter(int => int.manager.name == integrationKey).map(int => {
            intIds.push(int?.id)

            return {
                queryKey: ["app-integration", app?.id, integrationKey],
                queryFn: () => int?.manager.isAppAuthorized(app),
            }
        })
    })

    const results = useQueries(queries ?? [])

    return Object.fromEntries(results.map((res, i) => [intIds[i], res]))
}