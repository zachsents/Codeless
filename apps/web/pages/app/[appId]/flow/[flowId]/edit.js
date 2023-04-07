import { Box, Stack } from "@mantine/core"
import { useInterval } from "@mantine/hooks"
import { useUpdateFlowLastEdited } from "@minus/client-sdk"
import Head from "next/head"
import { useEffect } from "react"
import { ReactFlowProvider } from "reactflow"

import NodeBuilder from "@web/components/flow-editor/NodeBuilder"
import Header from "@web/components/flow-editor/header/Header"
import NodeMenu from "@web/components/flow-editor/node-menu/NodeMenu"
import { AppProvider, FlowProvider, useFlowContext } from "@web/modules/context"
import { useFlowId, useMustBeSignedIn } from "@web/modules/hooks"


export default function EditFlow() {

    useMustBeSignedIn()

    return (
        <AppProvider redirectOnNotExist="/dashboard">
            <FlowProvider redirectOnNotExist="/dashboard">
                <PageTitle />
                <ReactFlowProvider>
                    <Stack h="100vh" spacing={0}>
                        <Header />
                        <Box pos="relative" sx={{ flexGrow: 1 }}>
                            <NodeBuilder />
                            <NodeMenu />
                        </Box>
                    </Stack>
                    <LastEdited />
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


function PageTitle() {
    const { flow } = useFlowContext()

    const title = `Edit${flow?.name ? ` "${flow.name}"` : ""} | Minus`

    return <Head>
        <title key="title">{title}</title>
        <meta property="og:title" content={title} key="ogtitle" />
    </Head>
}