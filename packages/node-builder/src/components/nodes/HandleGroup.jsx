import { Stack, Group, useMantineTheme, Box } from '@mantine/core'
import { Handle, Position } from 'react-flow-renderer'
import { DataType } from '../../dataTypes'


export default function HandleGroup({ position, type, handles, hideLabel }) {

    const theme = useMantineTheme()

    const handleStyle = dataType =>
        dataType == DataType.Value ? valueHandleStyle(theme) :
            dataType == DataType.Signal ? signalHandleStyle(theme) : {}

    const handleComponents = handles?.map(({ name, dataType }, i) =>
        <Box sx={handleWrapperStyle} key={i}>
            <Handle
                type={type}
                id={`<${dataType}>${name}`}
                position={position}
                data-label={hideLabel ? "" : name}
                style={handleStyle(dataType)}
            />
        </Box>
    )

    return (
        position == Position.Left || position == Position.Right ?
            <Stack spacing={0} sx={stackStyle(position)}>
                {handleComponents}
            </Stack> :
            <Group spacing={0} position='center' sx={groupStyle(position)}>
                {handleComponents}
            </Group>
    )
}

const valueHandleStyle = theme => ({
    background: theme.colors.dark[3],
})

const signalHandleStyle = theme => ({
    background: theme.colors.red[6],
})

const handleOffset = 16
const hoverPadding = 10

const commonStyle = {
    position: 'absolute',
    zIndex: 10,
}
const stackStyle = position => theme => ({
    ...commonStyle,
    top: '50%',
    transform: "translateY(-50%)",
    left: position == Position.Left ? -handleOffset : 'auto',
    right: position == Position.Right ? -handleOffset : 'auto',
})
const groupStyle = position => theme => ({
    ...commonStyle,
    width: '100%',
    left: '50%',
    transform: "translateX(-50%)",
    top: position == Position.Top ? -handleOffset : 'auto',
    bottom: position == Position.Bottom ? -handleOffset : 'auto',
})

const handleWrapperStyle = {

    padding: hoverPadding,
    borderRadius: '100%',
    "&:hover .react-flow__handle": {
        transform: "scale(2)",
    }
}