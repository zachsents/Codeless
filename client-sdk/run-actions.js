import { Timestamp, addDoc, collection, doc, limit, onSnapshot, orderBy, query, runTransaction, where } from "firebase/firestore"
import { firestore } from "./firebase-init.js"
import { docDataWithId } from "./firestore-util.js"
import { assertFlowId } from "./flow-actions"
import { getStartDateFromSchedule } from "@minus/util"


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
 * @param {object} options
 * @param {Date | number} [options.scheduledFor]
 * @param {*} options.payload
 * @param {boolean} [options.recurring=false]
 * @param {import("@minus/util").RecurringFlowSchedule} [options.schedule]
 */
export async function scheduleFlowRun(flowId, {
    scheduledFor,
    payload = null,
    recurring = false,
    schedule,
} = {}) {

    assertFlowId(flowId)

    if (!scheduledFor && !recurring)
        throw new Error("Must include a schedule time")

    if (recurring && !schedule)
        throw new Error("Must include a schedule")

    const { id: runId } = await addDoc(RunsCollection(), {
        flow: flowId,
        payload,
        status: RunStatus.Scheduled,
        source: "client",

        ...(recurring ? {
            recurring: true,
            schedule,
            scheduledFor: Timestamp.fromDate(getStartDateFromSchedule(schedule)),
        } : {
            recurring: false,
            scheduledFor: Timestamp.fromMillis(scheduledFor.valueOf()),
        }),
    })

    return runId
}


export async function cancelScheduledRun(runId) {

    if (!runId)
        throw new Error("Must include a run ID")

    await runTransaction(firestore, async t => {
        const run = (await t.get(getRunRef(runId))).data()

        if (run.status !== RunStatus.Scheduled)
            throw new Error("Run is not scheduled")

        await t.update(getRunRef(runId), {
            status: RunStatus.Failed,
            failureError: JSON.stringify({ message: "Cancelled" })
        })
    })
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


/**
 * Waits for a run to finish and resolves with the run data.
 *
 * @export
 * @param {string} runId
 * @return {object} 
 */
export function waitForRunToEnd(runId) {
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


/**
 * Creates a query that looks for scheduled runs
 *
 * @export
 * @param {string} flowId
 */
export function createScheduledRunsQuery(flowId) {
    return flowId && query(
        RunsCollection(),
        where("flow", "==", flowId),
        where("status", "==", RunStatus.Scheduled),
        orderBy("scheduledFor", "asc"),
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