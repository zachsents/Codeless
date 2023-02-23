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
