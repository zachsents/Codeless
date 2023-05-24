import { dataWithId } from "./util.js"


/** @type {import("firebase-admin").firestore.Firestore} */
const db = global.db


export async function getFlow(id, { transaction } = {}) {

    const docRef = db.collection("flows").doc(id)
    const doc = transaction ? await transaction.get(docRef) : await docRef.get()

    if (!doc.exists)
        throw new Error(`No flow found with ID ${id}.`)

    return dataWithId(doc)
}

export async function getFlowTriggerData(id, { transaction } = {}) {

    const docRef = db.collection("triggerData").doc(id)
    const doc = transaction ? await transaction.get(docRef) : await docRef.get()

    if (!doc.exists)
        throw new Error(`No trigger data found for flow ${id}.`)

    return dataWithId(doc)
}

export async function updateFlowTriggerData(id, changes = {}, { transaction } = {}) {

    const docRef = db.collection("triggerData").doc(id)

    return transaction ? transaction.update(docRef, changes) : docRef.update(changes)
}

export async function getFlowGraph(id, { transaction } = {}) {

    const docRef = db.collection("flowGraphs").doc(id)
    const doc = transaction ? await transaction.get(docRef) : await docRef.get()

    if (!doc.exists)
        throw new Error(`No flow graph found for ID ${id}.`)

    return dataWithId(doc)
}

export async function getFlowGraphForFlow(flowId, {
    transaction,
    parse = false,
} = {}) {

    const flow = await getFlow(flowId, { transaction })
    const graph = await getFlowGraph(flow.graph, { transaction })

    return parse ? JSON.parse(graph.graph) : graph
}