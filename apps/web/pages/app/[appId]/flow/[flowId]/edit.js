import { useState } from "react"
import { ReactFlowProvider } from "reactflow"
import { AppShell } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useUpdateFlowGraph } from "@minus/client-sdk"
import { NodeBuilder } from "@minus/node-builder"

import { useAppId, useDebouncedCustomState, useMustBeSignedIn } from "../../../../../modules/hooks"
import { Nodes } from "../../../../../modules/nodes"
import { FlowProvider, useFlowContext } from "../../../../../modules/context"
import Header from "../../../../../components/flow-editor/Header"
import SettingsDrawer from "../../../../../components/flow-editor/SettingsDrawer"
import Sidebar from "../../../../../components/flow-editor/Sidebar"


export default function EditFlow() {
    return (
        <FlowProvider redirectOnNotExist="/dashboard">
            <ReactFlowProvider>
                <Editor />
            </ReactFlowProvider>
        </FlowProvider>
    )
}


function Editor() {

    useMustBeSignedIn()

    const appId = useAppId()
    const { flow, flowGraph } = useFlowContext()
    const updateFlowGraph = useUpdateFlowGraph(flowGraph?.id)

    const [settingsOpened, settingsHandlers] = useDisclosure(false)
    const [suggestedTab, setSuggestedTab] = useState()

    const [, setGraph] = useDebouncedCustomState(flowGraph?.graph, updateFlowGraph, 1000)

    const openSettings = tab => {
        settingsHandlers.open()
        setSuggestedTab(tab ?? null)
    }

    return (
        <AppShell
            padding={0}
            header={
                <Header
                    openSettings={openSettings}
                />
            }
            navbar={<Sidebar />}
        >
            {flow && flowGraph &&
                <NodeBuilder
                    nodeTypes={Nodes}
                    initialGraph={flowGraph.graph}
                    onChange={setGraph}
                    flowId={flow.id}
                    appId={appId}
                    lastRun={flow.runs?.[0]}
                    openSettings={openSettings}
                />}

            <SettingsDrawer
                opened={settingsOpened}
                onClose={settingsHandlers.close}
                suggestedTab={suggestedTab}
                onOpenedSuggestedTab={() => setSuggestedTab(null)}
            />
        </AppShell>
    )
}