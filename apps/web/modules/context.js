import { useRouter } from "next/router"
import { createContext, useContext } from "react"
import { useFlowRealtime } from "./hooks"


const FlowContext = createContext()

export function FlowProvider({ children }) {

    const { query: { appId, flowId } } = useRouter()
    const flow = useFlowRealtime(appId, flowId)

    return <FlowContext.Provider value={flow}>
        {children}
    </FlowContext.Provider>
}

export function useFlowContext() {
    return useContext(FlowContext)
}
