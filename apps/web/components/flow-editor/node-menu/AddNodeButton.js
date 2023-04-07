import { useReactFlow } from "reactflow"
import { Text, Kbd } from "@mantine/core"
import { useHotkeys } from "@mantine/hooks"
import { TbPlus } from "react-icons/tb"

import { openNodePalette } from "../../../modules/graph-util"
import ActionButton from "./ActionButton"


export default function AddNodeButton({ expanded }) {

    const rf = useReactFlow()
    const handleOpenNodePalette = () => openNodePalette(rf)

    useHotkeys([
        ["ctrl+P", handleOpenNodePalette]
    ])

    return expanded ?
        <ActionButton
            expanded={expanded}
            leftIcon={<TbPlus />}
            onClick={handleOpenNodePalette}
            label={
                <Text size="xs" align="center">
                    <Kbd>Ctrl</Kbd> + <Kbd>P</Kbd>
                </Text>
            }
            tooltipProps={{
                color: "transparent",
                position: "bottom",
            }}
            color={null}
        >
            Add Node
        </ActionButton> :
        <ActionButton
            expanded={expanded}
            label="Add Node"
            icon={TbPlus}
            onClick={handleOpenNodePalette}
            color={null}
        />
}
