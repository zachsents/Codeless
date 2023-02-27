import { useContext, createContext } from "react"


const NodeContext = createContext({})

export function NodeProvider({ id, type, children, ...props }) {

    return <NodeContext.Provider value={{ id, type, ...props }}>
        {children}
    </NodeContext.Provider>
}

export function useNodeContext() {
    return useContext(NodeContext)
}