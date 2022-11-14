import { collection, doc, getCountFromServer, getDoc, onSnapshot } from "firebase/firestore"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { firestore, getMappedDocs, mapSnapshot } from "./firebase"

export function useAsyncState(factory, dependencies = []) {
    const [state, setState] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    useEffect(() => {
        setLoading(true)
        factory?.()
            .then(results => {
                setState(results)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setError(err)
                setLoading(false)
            })
    }, dependencies)
    return [state, loading, error]
}

export function useRealtimeState(ref, selector) {
    const [state, setState] = useState()
    useEffect(() => {
        if (ref)
            return onSnapshot(ref, snap => setState(selector(snap)))
    }, [!!ref])
    return [state]
}

export function useAppId() {
    return useRouter().query.appId
}

export function useApp(appId = useAppId()) {

    const [app] = useAsyncState(async () => {
        return appId && {
            ...(await getDoc(
                doc(firestore, "apps", appId)
            )).data(),
            id: appId,
        }
    }, [appId])

    return app
}

export function usePlan(planRef) {
    const [plan] = useAsyncState(async () =>
        planRef && await getDoc(planRef)
        , [planRef])
    return plan?.data()
}

export function useFlows(appId) {
    const [flows] = useAsyncState(async () =>
        appId && await getMappedDocs(collection(firestore, "apps", appId, "flows"))
        , [appId])
    return flows
}

export function useFlowsRealtime(appId) {
    const [flows] = useRealtimeState(
        appId && collection(firestore, "apps", appId, "flows"),
        mapSnapshot
    )
    return flows
}

export function useFlowRealtime(appId, flowId) {
    const [flow] = useRealtimeState(
        appId && flowId && doc(firestore, "apps", appId, "flows", flowId),
        doc => doc.data()
    )
    return flow
}

export function useFlowCount(appId) {
    const [flowCount] = useAsyncState(async () =>
        appId && (await getCountFromServer(
            collection(firestore, "apps", appId, "flows")
        )).data().count
        , [appId])
    return flowCount
}

export function useCollections(appId) {
    const [collections] = useAsyncState(async () =>
        appId && await getMappedDocs(collection(firestore, "apps", appId, "collections"))
        , [appId])
    return collections
}

export function useCollectionsRealtime(appId) {
    const [collections] = useRealtimeState(
        appId && collection(firestore, "apps", appId, "collections"),
        mapSnapshot
    )
    return collections
}

export function useCollectionCount(appId) {
    const [collectionCount] = useAsyncState(async () =>
        appId && (await getCountFromServer(
            collection(firestore, "apps", appId, "collections")
        )).data().count
        , [appId])
    return collectionCount
}