import { useRealtime } from "./firestore-util"
import { createLatestRunQuery, createRunQuery } from "./run-actions"


/**
 * Hook that provides the real-time updated latest run for
 * a flow.
 *
 * @export
 * @param {string} flowId
 */
export function useLatestRunRealtime(flowId) {
    const [queryResult] = useRealtime(createLatestRunQuery(flowId))
    return [queryResult?.[0]]
}


/**
 * Hook that provides the real-time updated runs for
 * a flow.
 *
 * @export
 * @param {string} flowId
 * @param {object} [options]
 */
export function useRunsRealtime(flowId, options = {
    limit: 10,
}) {
    return useRealtime(createRunQuery(flowId, options), {
        dependencies: [flowId, ...Object.values(options)]
    })
}