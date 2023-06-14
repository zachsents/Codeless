import { Box, Stack } from "@mantine/core"
import { useInterval } from "@mantine/hooks"
import { useUpdateFlowLastEdited } from "@minus/client-sdk"
import Head from "next/head"
import { useEffect } from "react"
import { ReactFlowProvider } from "reactflow"

import NodeBuilder from "@web/components/flow-editor/NodeBuilder"
import Header from "@web/components/flow-editor/header/Header"
import { AppProvider, FlowProvider, ReplayProvider, useFlowContext } from "@web/modules/context"
import { useFlowId, useMustBeSignedIn } from "@web/modules/hooks"


export default function EditFlow() {

    useMustBeSignedIn()

    return (
        <>
            <AppProvider redirectOnNotExist="/apps">
                <FlowProvider redirectOnNotExist="/apps">
                    <ReplayProvider>
                        <PageTitle />
                        <ReactFlowProvider>
                            <Stack h="100vh" spacing={0} sx={{ overflow: "hidden" }}>
                                <Header />
                                <Box pos="relative" sx={{ flexGrow: 1 }}>
                                    <NodeBuilder />
                                </Box>
                            </Stack>
                            <LastEdited />
                        </ReactFlowProvider>
                    </ReplayProvider>
                </FlowProvider>
            </AppProvider>

            {/* Scale everything down for this page */}
            <style>{`html {font-size: 16px;}`}</style>
        </>
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


function PageTitle() {
    const { flow } = useFlowContext()

    const title = `Edit${flow?.name ? ` "${flow.name}"` : ""} | Minus`

    return <Head>
        <title key="title">{title}</title>
        <meta property="og:title" content={title} key="ogtitle" />
    </Head>
}