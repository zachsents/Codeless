import { addDoc, collection, deleteDoc, doc, getCountFromServer, query, serverTimestamp, updateDoc, where } from "firebase/firestore"
import { httpsCallable } from "firebase/functions"
import { firestore, functions } from "./firebase-init.js"
import { getDocsWithIds, getDocWithId } from "./firestore-util.js"


export const FlowsCollectionPath = "flows"
export const FlowsCollection = () => collection(firestore, FlowsCollectionPath)

export const FlowGraphsCollectionPath = "flowGraphs"
export const FlowGraphsCollection = () => collection(firestore, FlowGraphsCollectionPath)


/**
 * Creates a reference to an flow document.
 *
 * @export
 * @param {string} flowId
 */
export function getFlowRef(flowId) {
    return flowId && doc(FlowsCollection(), flowId)
}


/**
 * Creates a reference to an flow graph document.
 *
 * @export
 * @param {string} flowGraphId
 */
export function getFlowGraphRef(flowGraphId) {
    return flowGraphId && doc(FlowGraphsCollection(), flowGraphId)
}


/**
 * Gets flow details.
 *
 * @export
 * @param {string} flowId
 */
export function getFlow(flowId) {
    return flowId && getDocWithId(getFlowRef(flowId))
}


/**
 * Gets a flow graph.
 *
 * @export
 * @param {string} flowGraphId
 */
export function getFlowGraph(flowGraphId) {
    return flowGraphId && getDocWithId(getFlowGraphRef(flowGraphId))
}



/**
 * Creates a flow.
 *
 * @export
 * @param {object} options
 * @param {string} options.name
 * @param {string} options.trigger
 * @param {string[]} options.ownerIds
 */
export async function createFlow({
    appId,
    name,
    trigger,
    initialGraph = "{}",
} = {}) {

    if (!appId) throw new Error("Must include an app ID when creating an flow.")
    if (!name) throw new Error("Must include a trigger when creating an flow.")
    if (!trigger) throw new Error("Must include a name when creating an flow.")

    const { id: flowGraphId } = await addDoc(FlowGraphsCollection(), {
        graph: initialGraph,
    })

    return addDoc(FlowsCollection(), {
        name,
        apps: [appId],
        graph: flowGraphId,
        trigger,
        created: serverTimestamp(),
        published: false,
    })
}


/**
 * Renames a flow.
 *
 * @export
 * @param {string} flowId
 * @param {string} newName
 */
export function renameFlow(flowId, newName) {

    assertFlowId(flowId)

    if (!newName)
        throw new Error("Must include a new name when renaming a flow.")

    return updateDoc(getFlowRef(flowId), { name: newName })
}


/**
 * Deletes a flow.
 *
 * @export
 * @param {string} flowId
 */
export async function deleteFlow(flowId) {
    assertFlowId(flowId)

    const { graph: flowGraphId } = await getFlow(flowId)

    return Promise.all([
        deleteDoc(getFlowRef(flowId)),
        deleteDoc(getFlowGraphRef(flowGraphId))
    ])
}


/**
 * Updates a flow graph.
 *
 * @export
 * @param {string} flowGraphId
 * @param {string} newGraph
 */
export function updateFlowGraph(flowGraphId, newGraph) {
    assertFlowGraphId(flowGraphId)

    if (!newGraph)
        throw new Error("Must include a new graph string when updating a flow graph.")

    return updateDoc(getFlowGraphRef(flowGraphId), { graph: newGraph })
}


/**
 * Creates a query for flows by app ID.
 *
 * @export
 * @param {string} appId
 */
export function createFlowsForAppQuery(appId) {
    return appId && query(
        FlowsCollection(),
        where("apps", "array-contains", appId)
    )
}


/**
 * Queries flows by app ID.
 *
 * @export
 * @param {string} appId
 */
export function getFlowsForApp(appId) {
    return appId && getDocsWithIds(
        createFlowsForAppQuery(appId)
    )
}


/**
 * Counts the number of flows for an app.
 *
 * @export
 * @param {string} appId
 */
export async function getFlowCountForApp(appId) {

    if (!appId)
        return

    const snap = await getCountFromServer(
        createFlowsForAppQuery(appId)
    )

    return snap.data().count
}


/**
 * Publishes a flow.
 *
 * @export
 * @param {string} flowId
 */
export async function publishFlow(flowId) {

    assertFlowId(flowId)

    const { error } = await httpsCallable(functions, "flow-publish")({ flowId })

    if (error)
        throw new Error(error)

    await updateDoc(getFlowRef(flowId), { published: true })
}


/**
 * Unpublishes a flow.
 *
 * @export
 * @param {string} flowId
 */
export async function unpublishFlow(flowId) {

    assertFlowId(flowId)

    const { error } = await httpsCallable(functions, "flow-unpublish")({ flowId })

    if (error)
        throw new Error(error)

    await updateDoc(getFlowRef(flowId), { published: false })
}


/**
 * Throws an error if a falsy flow ID is included.
 *
 * @param {string} flowId
 */
function assertFlowId(flowId) {
    if (!flowId)
        throw new Error("Must include a flow ID.")
}


/**
 * Throws an error if a falsy flow graph ID is included.
 *
 * @param {string} flowGraphId
 */
function assertFlowGraphId(flowGraphId) {
    if (!flowGraphId)
        throw new Error("Must include a flow graph ID.")
}