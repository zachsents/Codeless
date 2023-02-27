import { Accordion } from "@mantine/core"
import { useReactFlow } from "reactflow"

import { getNodeType, NodeProvider } from "@minus/graph-util"
import { useAppContext } from "../../../modules/context"
import { useAppId, useFlowId } from "../../../modules/hooks"
import AccordionTitle from "./AccordionTitle"
import { usePanelMaximized } from "./config-store"


export default function OptionsSection({ nodeId, active }) {

    const rf = useReactFlow()

    const appId = useAppId()
    const flowId = useFlowId()

    const { integrations } = useAppContext()

    const node = rf.getNode(nodeId)
    const nodeType = getNodeType(node)

    const maximized = usePanelMaximized(nodeId)

    return (
        <Accordion.Item value="options">
            <Accordion.Control>
                <AccordionTitle active={active}>
                    Options
                </AccordionTitle>
            </Accordion.Control>
            <Accordion.Panel>
                <NodeProvider
                    id={nodeId}
                    type={nodeType}
                    appId={appId}
                    flowId={flowId}
                >
                    {node &&
                        <nodeType.configuration
                            maximized={maximized}
                            appIntegrations={integrations}
                        />}
                </NodeProvider>
            </Accordion.Panel>
        </Accordion.Item>
    )
}
