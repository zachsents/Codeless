import { useRealtime } from "./firestore-util"
import { createLatestRunQuery } from "./run-actions"


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