import { Integrations } from "@minus/client-nodes"
import { useAppDetailsRealtime, useAppIntegrations, useFlowGraphRealtime, useFlowRealtime, useRunsRealtime } from "@minus/client-sdk"
import { useRouter } from "next/router"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useAppId, useFlowId } from "./hooks"


const FlowContext = createContext()

export function FlowProvider({ children, redirectOnNotExist = false, }) {

    const router = useRouter()

    const flowId = useFlowId()
    const [flow] = useFlowRealtime(flowId)
    const [flowGraph] = useFlowGraphRealtime(flow?.graph)

    // redirect if flow doesn't exist
    useEffect(() => {
        redirectOnNotExist && flow === false && router.push(redirectOnNotExist)
    }, [flow])

    const [dirty, setDirty] = useState(false)

    return <FlowContext.Provider value={{ flow, flowGraph, dirty, setDirty }}>
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

    // redirect if app doesn't exist
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


const ReplayContext = createContext()

export function ReplayProvider({ children }) {

    const flowId = useFlowId()
    const [runLimit, setRunLimit] = useState(10)
    const [runs] = useRunsRealtime(flowId, {
        limit: runLimit,
    })
    const [runId, setRunId] = useState()

    const run = useMemo(() => runs?.find(run => run.id === runId), [runs, runId])

    return <ReplayContext.Provider value={{ runs, run, setRunId, runLimit, setRunLimit }}>
        {children}
    </ReplayContext.Provider>
}

export function useReplayContext() {
    return useContext(ReplayContext)
}