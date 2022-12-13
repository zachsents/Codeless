import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import Header from '../../../../../components/flow-editor/Header'
import SettingsDrawer from '../../../../../components/flow-editor/SettingsDrawer'
import Sidebar from '../../../../../components/flow-editor/Sidebar'
import { FlowProvider, useFlowContext } from '../../../../../modules/context'
import { NodeBuilder } from "@minus/node-builder"
import { ReactFlowProvider } from "reactflow"
import { Nodes } from '../../../../../modules/nodes'
import { useAppId, useDebouncedCustomState } from '../../../../../modules/hooks'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { firestore, useMustBeSignedIn } from '../../../../../modules/firebase'


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
    const flow = useFlowContext()

    const [settingsOpened, settingsHandlers] = useDisclosure(false)
    const [suggestedTab, setSuggestedTab] = useState()

    const [, setGraph] = useDebouncedCustomState(flow?.graph, newGraph => {
        appId && flow?.id && updateDoc(
            doc(firestore, "apps", appId, "flows", flow.id),
            {
                graph: newGraph,
                lastEdited: serverTimestamp(),
            }
        )
    }, 500)

    const openSettings = tab => {
        settingsHandlers.open()
        setSuggestedTab(tab)
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
            {flow && <NodeBuilder
                nodeTypes={Nodes}
                initialGraph={flow.graph}
                onChange={setGraph}
                flowId={flow.id}
                appId={appId}
                firestore={firestore}
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