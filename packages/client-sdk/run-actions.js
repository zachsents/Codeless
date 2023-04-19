import { addDoc, collection, doc, limit, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore"
import { firestore } from "./firebase-init.js"
import { docDataWithId } from "./firestore-util.js"
import { assertFlowId } from "./flow-actions"


export const RunsCollectionPath = "flowRuns"
export const RunsCollection = () => collection(firestore, RunsCollectionPath)


export const RunStatus = {
    Pending: "pending",
    Scheduled: "scheduled",
    Validated: "validated",
    FailedValidation: "failed-validation",
    Finished: "finished",
    FinishedWithErrors: "finished-with-errors",
    Failed: "failed",
}


/**
 * Creates a reference to an flow run document.
 *
 * @export
 * @param {string} runId
 */
export function getRunRef(runId) {
    return runId && doc(RunsCollection(), runId)
}


/**
 * Starts a flow run.
 *
 * @export
 * @param {string} flowId
 * @param {*} payload
 */
export async function startFlowRun(flowId, payload = null) {

    assertFlowId(flowId)

    const { id: runId } = await addDoc(RunsCollection(), {
        flow: flowId,
        payload,
        status: RunStatus.Pending,
        source: "client",
    })

    return runId
}


/**
 * Schedules a flow run.
 *
 * @export
 * @param {string} flowId
 * @param {Date | number} scheduledFor
 * @param {*} payload
 */
export async function scheduleFlowRun(flowId, scheduledFor, payload = null) {

    assertFlowId(flowId)

    if (!scheduledFor)
        throw new Error("Must include a schedule time")

    const { id: runId } = await addDoc(RunsCollection(), {
        flow: flowId,
        payload,
        scheduledFor: Timestamp.fromMillis(scheduledFor.valueOf()),
        status: RunStatus.Scheduled,
        source: "client",
    })

    return runId
}


/**
 * Runs a flow and resolves on completion.
 *
 * @export
 * @param {string} flowId
 * @param {*} payload
 */
export async function runFlow(flowId, payload) {

    const runId = await startFlowRun(flowId, payload)

    return {
        runId,
        finished: waitForRunToEnd(runId),
    }
}


function waitForRunToEnd(runId) {
    let unsubscribe
    return new Promise((resolve, reject) => {
        unsubscribe = onSnapshot(getRunRef(runId), snapshot => {
            const run = docDataWithId(snapshot)

            switch (run.status) {
                case RunStatus.Finished:
                case RunStatus.FinishedWithErrors:
                    unsubscribe()
                    resolve(run)
                    return
                case RunStatus.Failed:
                case RunStatus.FailedValidation:
                    unsubscribe()
                    reject(run)
                    return
            }
        })
    })
}


/**
 * Creates a query that looks for the latest run for a
 * flow.
 *
 * @export
 * @param {string} flowId
 */
export function createLatestRunQuery(flowId) {
    return flowId && query(
        RunsCollection(),
        where("flow", "==", flowId),
        orderBy("ranAt", "desc"),
        limit(1)
    )
}


/**
 * Creates a query that looks for the latest runs
 * for a flow. Limit is specified by the limit param.
 *
 * @export
 * @param {string} flowId
 * @param {Object} [options]
 * @param {number} [options.limit=10]
 */
export function createRunQuery(flowId, {
    limit: limitNum = 10,
} = {}) {
    return flowId && query(
        RunsCollection(),
        where("flow", "==", flowId),
        orderBy("ranAt", "desc"),
        limit(limitNum)
    )
}


export function isEnded(status) {
    return isFinished(status) || isFailed(status)
}

export function isFinished(status) {
    return [
        RunStatus.Finished,
        RunStatus.FinishedWithErrors,
    ].includes(status)
}

export function isFailed(status) {
    return [
        RunStatus.Failed,
        RunStatus.FailedValidation,
    ].includes(status)
}

export function isPending(status) {
    return status === RunStatus.Pending
}

export function isScheduled(status) {
    return status === RunStatus.Scheduled
}