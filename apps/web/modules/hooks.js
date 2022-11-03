import { collection, doc, getDoc, onSnapshot } from "firebase/firestore"
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