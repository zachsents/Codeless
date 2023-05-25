import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { QueryClient, QueryClientProvider } from "react-query"

import { mantineTheme } from "@web/theme"
import "../styles/globals.css"

import RouterTransition from "@web/components/RouterTransition"
import NodePalette from "@web/components/flow-editor/node-palette/NodePalette"
import CreateAppModal from "@web/components/modals/CreateAppModal"
import { DataViewerModal, DataViewerModalName } from "@web/components/modals/DataViewerModal"
import DeleteAppModal from "@web/components/modals/DeleteAppModal"
import DeleteFlowModal from "@web/components/modals/DeleteFlowModal"
import RenameFlowModal from "@web/components/modals/RenameFlowModal"
import ScheduleFlowModal from "@web/components/modals/ScheduleFlowModal"

import { initializeFirebase } from "@minus/client-sdk"
import { Notifications } from "@mantine/notifications"
initializeFirebase()


const queryClient = new QueryClient()


export default function MyApp({ Component, pageProps }) {
    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={mantineTheme} withNormalizeCSS withGlobalStyles withCSSVariables>
                <ModalsProvider modals={modals}>
                    {/* This wrapper makes the footer stick to the bottom of the page */}
                    <div className="min-h-screen flex flex-col">
                        <Component {...pageProps} />
                    </div>
                    <RouterTransition />
                    <Notifications autoClose={4000} />
                </ModalsProvider>
            </MantineProvider>
        </QueryClientProvider>
    )
}


const modals = {
    CreateApp: CreateAppModal,
    DeleteApp: DeleteAppModal,
    RenameFlow: RenameFlowModal,
    DeleteFlow: DeleteFlowModal,
    ScheduleFlow: ScheduleFlowModal,
    NodePalette: NodePalette,
    [DataViewerModalName]: DataViewerModal,
}
