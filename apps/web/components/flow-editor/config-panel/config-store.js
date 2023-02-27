import { produce } from "immer"
import create from "zustand"


export const useConfigStore = create(set => ({
    actions: {
        setAccordionValue: (id, val) => set(produce(draft => {
            draft[id] ??= {}
            draft[id].accordionValue = val
        })),
        togglePanelMaximized: id => set(produce(draft => {
            draft[id] ??= {}
            draft[id].panelMaximized = !draft[id].panelMaximized
        })),
    },
}))


export function usePanelMaximized(nodeId) {
    return useConfigStore(s => s[nodeId]?.panelMaximized ?? false)
}

export function useAccordionValue(nodeId) {
    return useConfigStore(s => s[nodeId]?.accordionValue)
}