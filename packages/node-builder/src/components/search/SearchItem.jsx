import { Badge, Box, Group, HoverCard, Paper, Stack, Text } from '@mantine/core'
import React, { forwardRef } from 'react'
import { useReactFlow } from 'react-flow-renderer'

const SearchItem = forwardRef(({ name, children, badges, createNode }, ref) => {

    const reactFlow = useReactFlow()

    const handleClick = () => {
        const newNode = createNode?.()
        reactFlow.setNodes(nodes => [...nodes, newNode])
        // close?.()
    }

    return (
        <Paper radius="sm" shadow="md" sx={containerStyle} onClick={handleClick} ref={ref}>
            <Group spacing="xs">
                <Box sx={{ flexGrow: 1, flexBasis: 0 }}>
                    <Text>{name}</Text>
                    <Text color="gray" size="xs">{children}</Text>
                </Box>
                {badges}
            </Group>
        </Paper>
    )
})
export default SearchItem

const containerStyle = theme => ({
    marginBottom: 6,
    padding: "5px 10px",
    cursor: "pointer",
})