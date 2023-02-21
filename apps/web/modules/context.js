import { createContext, useContext, useEffect } from "react"
import { useRouter } from "next/router"
import { useAppDetailsRealtime, useAppIntegrations, useFlowGraphRealtime, useFlowRealtime, useLatestRunRealtime } from "@minus/client-sdk"
import { Integrations } from "@minus/client-nodes"
import { useAppId, useFlowId } from "./hooks"


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


const AppContext = createContext()

export function AppProvider({ children, redirectOnNotExist = false }) {

    const router = useRouter()

    const appId = useAppId()
    const [app] = useAppDetailsRealtime(appId)
    const integrations = useAppIntegrations(app, Integrations)

    // redirect if flow doesn't exist
    useEffect(() => {
        redirectOnNotExist && app === false && router.push(redirectOnNotExist)
    }, [app])

    return <AppContext.Provider value={{ app, integrations }}>
        {children}
    </AppContext.Provider>
}

export function useAppContext() {
    return useContext(AppContext)
}