import { AppShell } from '@mantine/core'
import Header from '../../../../../components/flow-editor/Header'
import Sidebar from '../../../../../components/flow-editor/Sidebar'
import { useAppId } from "../../../../../modules/hooks"


export default function EditFlow() {

    const appId = useAppId()

    return (
        <AppShell
            header={<Header />}
            navbar={<Sidebar />}
        >

        </AppShell>
    )
}

