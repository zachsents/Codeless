import { AppShell } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import Header from '../../../../../components/flow-editor/Header'
import SettingsDrawer from '../../../../../components/flow-editor/SettingsDrawer'
import Sidebar from '../../../../../components/flow-editor/Sidebar'
import { FlowProvider } from '../../../../../modules/context'


export default function EditFlow() {

    const [settingsOpened, settingsHandlers] = useDisclosure(false)
    const [suggestedTab, setSuggestedTab] = useState()

    return (
        <FlowProvider>
            <AppShell
                header={
                    <Header
                        openSettings={tab => {
                            settingsHandlers.open()
                            setSuggestedTab(tab)
                        }}
                    />
                }
                navbar={<Sidebar />}
            >
                <SettingsDrawer opened={settingsOpened} onClose={settingsHandlers.close} suggestedTab={suggestedTab} />
            </AppShell>
        </FlowProvider>
    )
}


