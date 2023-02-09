import { useState } from "react"
import { ReactFlowProvider } from "reactflow"
import { AppShell } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"

import { useMustBeSignedIn } from "../../../../../modules/hooks"
import { FlowProvider } from "../../../../../modules/context"
import NodeBuilder from "../../../../../components/flow-editor/NodeBuilder"
import Header from "../../../../../components/flow-editor/Header"
import SettingsDrawer from "../../../../../components/flow-editor/SettingsDrawer"
import Sidebar from "../../../../../components/flow-editor/Sidebar"


export default function EditFlow() {

    useMustBeSignedIn()

    const [settingsOpened, settingsHandlers] = useDisclosure(false)
    const [suggestedTab, setSuggestedTab] = useState()

    const openSettings = tab => {
        settingsHandlers.open()
        setSuggestedTab(tab ?? null)
    }

    return (
        <FlowProvider redirectOnNotExist="/dashboard">
            <ReactFlowProvider>
                <AppShell
                    padding={0}
                    header={
                        <Header
                            openSettings={openSettings}
                        />
                    }
                    navbar={<Sidebar />}
                >
                    <NodeBuilder />

                    <SettingsDrawer
                        opened={settingsOpened}
                        onClose={settingsHandlers.close}
                        suggestedTab={suggestedTab}
                        onOpenedSuggestedTab={() => setSuggestedTab(null)}
                    />
                </AppShell>
            </ReactFlowProvider>
        </FlowProvider>
    )
}