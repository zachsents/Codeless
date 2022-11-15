import { useRouter } from "next/router"
import { createContext, useContext, useEffect } from "react"
import { useFlowRealtime } from "./hooks"


const FlowContext = createContext()

export function FlowProvider({ children, redirectOnNotExist = false, }) {

    const { query: { appId, flowId }, push } = useRouter()
    const flow = useFlowRealtime(appId, flowId)

    // redirect if flow doesn't exist
    useEffect(() => {
        redirectOnNotExist && flow === false && push(redirectOnNotExist)
    }, [flow])

    return <FlowContext.Provider value={flow}>
        {children}
    </FlowContext.Provider>
}

export function useFlowContext() {
    return useContext(FlowContext)
}
