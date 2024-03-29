import { collection, deleteDoc, doc, documentId, getCountFromServer, getDoc, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore"
import { httpsCallable } from "firebase/functions"
import { firestore, functions } from "./firebase-init.js"
import { getDocWithId, getDocsWithIds } from "./firestore-util.js"


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

    // create doc refs so we can reference them
    const flowDocRef = doc(FlowsCollection())
    const flowGraphDocRef = doc(FlowGraphsCollection())

    // create flow and flow graph documents
    await Promise.all([
        setDoc(flowDocRef, {
            name,
            app: appId,
            graph: flowGraphDocRef.id,
            trigger,
            created: serverTimestamp(),
            published: false,
        }),
        setDoc(flowGraphDocRef, {
            flow: flowDocRef.id,
            graph: initialGraph,
        }),
    ])

    // return references
    return [flowDocRef, flowGraphDocRef]
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

    // Delete graph first so we don't have to worry about orphaned graphs
    await deleteDoc(getFlowGraphRef(flowGraphId))
    await deleteDoc(getFlowRef(flowId))
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
 * Updates a flow with a change object.
 *
 * @export
 * @param {string} flowId
 * @param {object} [changes={}]
 */
export function updateFlow(flowId, changes = {}) {
    assertFlowId(flowId)

    return updateDoc(getFlowRef(flowId), changes)
}


/**
 * Updates a flow's lastEdited field. Defaults to the current time.
 *
 * @export
 * @param {string} flowId
 * @param {Timestamp} [lastEdited=serverTimestamp()]
 */
export function updateFlowLastEdited(flowId, lastEdited = serverTimestamp()) {
    return updateFlow(flowId, { lastEdited })
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
        where("app", "==", appId)
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
    await httpsCallable(functions, "flow-publish")({ flowId })
}


/**
 * Unpublishes a flow.
 *
 * @export
 * @param {string} flowId
 */
export async function unpublishFlow(flowId) {
    assertFlowId(flowId)
    await httpsCallable(functions, "flow-unpublish")({ flowId })
}


/**
 * Creates a query that looks for flows that can be ran
 * manually, including the one given.
 *
 * @export
 * @param {string} flowId
 * @param {string} appId
 */
export function createRunnableFlowsQuery(flowId, appId) {
    return flowId && query(
        FlowsCollection(),
        where("trigger", "==", "basic:DefaultTrigger"),
        where("app", "==", appId)
    )
}


/**
 * Creates a query that looks for flows that can be ran
 * manually, excluding the one given.
 *
 * @export
 * @param {string} flowId
 * @param {string} appId
 */
export function createOtherRunnableFlowsQuery(flowId, appId) {
    return flowId && query(
        FlowsCollection(),
        where(documentId(), "!=", flowId),
        where("trigger", "==", "basic:DefaultTrigger"),
        where("app", "==", appId)
    )
}


/**
 * Queries flows flows that can be ran manually, excluding 
 * the one given.
 *
 * @export
 * @param {string} flowId
 */
export function getOtherRunnableFlows(flowId) {
    return flowId && getDocsWithIds(
        createOtherRunnableFlowsQuery(flowId)
    )
}


/**
 * Gets node suggestions for a given node type.
 *
 * @export
 * @param {string} nodeType
 * @param {string} handle
 */
export async function getNodeSuggestions(nodeType) {
    if (!nodeType)
        return {}

    const nodeTypeDoc = await getDoc(doc(firestore, `edgeIndex/${nodeType}`))
    const nodeTypeData = nodeTypeDoc.data()

    nodeTypeData && Object.keys(nodeTypeData).forEach(handle => {
        nodeTypeData[handle] = Object.entries(nodeTypeData[handle]).flatMap(
            ([outboundNodeType, outboundHandles]) => Object.entries(outboundHandles).map(
                ([outboundHandle, data]) => ({
                    node: outboundNodeType,
                    handle: outboundHandle,
                    score: Math.sqrt(data.timesSuccessful),
                })
            )
        ).sort((a, b) => b.score - a.score)
    })

    return nodeTypeData ?? {}
}


/**
 * Throws an error if a falsy flow ID is included.
 *
 * @param {string} flowId
 */
export function assertFlowId(flowId) {
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