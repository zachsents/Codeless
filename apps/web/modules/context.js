import { useFlowGraphRealtime, useFlowRealtime, useLatestRunRealtime } from "@minus/client-sdk"
import { useRouter } from "next/router"
import { createContext, useContext, useEffect } from "react"
import { useFlowId } from "./hooks"


const FlowContext = createContext()

export function FlowProvider({ children, redirectOnNotExist = false, }) {

    const router = useRouter()

    const flowId = useFlowId()
    const [flow] = useFlowRealtime(flowId)
    const [flowGraph] = useFlowGraphRealtime(flow?.graph)
    const [latestRun] = useLatestRunRealtime(flowId)

    // redirect if flow doesn't exist
    useEffect(() => {
        redirectOnNotExist && flow === false && router.push(redirectOnNotExist)
    }, [flow])

    return <FlowContext.Provider value={{ flow, flowGraph, latestRun }}>
        {children}
    </FlowContext.Provider>
}

export function useFlowContext() {
    return useContext(FlowContext)
}
