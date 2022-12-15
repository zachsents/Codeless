import { Triggers } from "@minus/client-nodes"
import { firestore, functions } from "./firebase"
import { doc, updateDoc } from 'firebase/firestore'
import { useCallback, useState } from "react"


export function useFlowPublishing(flow, appId) {
    const [loading, setLoading] = useState(false)

    const publish = useCallback(async () => {
        console.debug(`Publishing ${flow?.name}...`)

        setLoading(true)
        // execute publishing routine from trigger node
        const result = await Triggers[flow?.trigger]?.onPublish?.({ appId, flow, functions })
        // write field on document
        !result?.error && await setPublishedOnDocument(appId, flow?.id, true)
        setLoading(false)

        console.debug(!result?.error ? "Done." : "Failed.")
    }, [flow, appId, setLoading])

    const unpublish = useCallback(async () => {
        console.debug(`Unpublishing ${flow?.name}...`)

        setLoading(true)
        // execute unpublishing routine from trigger node
        const result = await Triggers[flow?.trigger]?.onUnpublish?.({ appId, flow, functions }) ?? true
        // write field on document
        !result?.error && await setPublishedOnDocument(appId, flow?.id, false)
        setLoading(false)
        
        console.debug(!result?.error ? "Done." : "Failed.")
    }, [flow, appId, setLoading])

    return { 
        published: flow?.deployed,
        publish,
        unpublish,
        loading,
    }
}

function setPublishedOnDocument(appId, flowId, published = false) {
    return appId && flowId &&
        updateDoc(
            doc(firestore, "apps", appId, "flows", flowId),
            { deployed: published }
        )
}