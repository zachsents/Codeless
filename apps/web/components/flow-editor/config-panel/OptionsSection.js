import { Accordion } from "@mantine/core"
import { useReactFlow } from "reactflow"

import { useAppContext } from "../../../modules/context"
import { getNodeType, useNodeDisplayProps } from "../../../modules/graph-util"
import AccordionTitle from "./AccordionTitle"


export default function OptionsSection({ nodeId, active }) {

    const rf = useReactFlow()

    const { integrations } = useAppContext()
    const displayProps = useNodeDisplayProps(nodeId)

    const node = rf.getNode(nodeId)
    const nodeType = getNodeType(node)

    return (
        <Accordion.Item value="options">
            <Accordion.Control>
                <AccordionTitle active={active}>
                    Options
                </AccordionTitle>
            </Accordion.Control>
            <Accordion.Panel>
                {node &&
                    <nodeType.configuration
                        {...displayProps}
                        appIntegrations={integrations}
                    />}
            </Accordion.Panel>
        </Accordion.Item>
    )
}
