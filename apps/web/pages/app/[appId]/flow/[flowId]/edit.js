import { useEffect, useState } from "react"
import { ReactFlowProvider } from "reactflow"
import { AppShell } from "@mantine/core"
import { useDisclosure, useInterval } from "@mantine/hooks"
import { useUpdateFlowLastEdited } from "@minus/client-sdk"

import { useFlowId, useMustBeSignedIn } from "../../../../../modules/hooks"
import { AppProvider, FlowProvider } from "../../../../../modules/context"
import NodeBuilder from "../../../../../components/flow-editor/NodeBuilder"
import Header from "../../../../../components/flow-editor/Header"
import SettingsDrawer from "../../../../../components/flow-editor/SettingsDrawer"
import Sidebar from "../../../../../components/flow-editor/sidebar/Sidebar"


export default function EditFlow() {

    useMustBeSignedIn()

    const [settingsOpened, settingsHandlers] = useDisclosure(false)
    const [suggestedTab, setSuggestedTab] = useState()

    const openSettings = tab => {
        settingsHandlers.open()
        setSuggestedTab(tab ?? null)
    }

    return (
        <AppProvider redirectOnNotExist="/dashboard">
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

                        <LastEdited />
                    </AppShell>
                </ReactFlowProvider>
            </FlowProvider>
        </AppProvider>
    )
}


function LastEdited() {

    const flowId = useFlowId()

    // update lastEdited field on mount and every minute
    const updateLastEdited = useUpdateFlowLastEdited(flowId)
    const lastEditedInterval = useInterval(updateLastEdited, 60 * 1000)

    useEffect(() => {
        if (flowId) {
            updateLastEdited()
            lastEditedInterval.start()
            return lastEditedInterval.stop
        }
    }, [flowId])

    return <></>
}