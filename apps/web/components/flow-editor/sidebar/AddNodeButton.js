import { useCallback } from 'react'
import { Title, Text, Kbd } from '@mantine/core'
import { useHotkeys } from '@mantine/hooks'
import { openContextModal } from '@mantine/modals'
import { TbPlus } from 'react-icons/tb'
import ActionButton from './ActionButton'
import { useReactFlow } from 'reactflow'


export default function AddNodeButton({ expanded }) {

    const rf = useReactFlow()

    const openNodePalette = useCallback(() => openContextModal({
        modal: "NodePalette",
        innerProps: { rf },
        title: <Title order={3}>Add a node</Title>,
        size: "lg",
        centered: true,
        transitionDuration: 200,
    }), [rf])

    useHotkeys([
        ["ctrl+P", openNodePalette]
    ])

    return expanded ?
        <ActionButton
            expanded={expanded}
            leftIcon={<TbPlus />}
            onClick={openNodePalette}
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
            onClick={openNodePalette}
            color={null}
        />
}
