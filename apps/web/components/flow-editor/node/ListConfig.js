import { ActionIcon, Box, Button, Center, Grid, Stack, Text, TextInput, ThemeIcon, Tooltip } from "@mantine/core"
import { InputMode, ListMode, useHandleConnected, useHandleDefinition, useInputMode, useListHandle, useNodeContext } from "@minus/client-nodes/hooks/nodes"
import { useUpdateNode } from "@web/modules/graph-util"
import { Reorder, useDragControls } from "framer-motion"
import { customAlphabet } from "nanoid"
import { alphanumeric } from "nanoid-dictionary"
import { useEffect } from "react"
import { TbGridDots, TbPlus, TbX } from "react-icons/tb"
import styles from "./ListConfig.module.css"


export default function ListConfig({ handleId }) {

    const [list, setList] = useListHandle(null, handleId)

    const addItem = () => {
        setList([{ id: generateId() }], true)
    }

    // Side-Effect: fix node internals when list order changes
    const updateNode = useUpdateNode()
    useEffect(() => {
        updateNode()
    }, [list?.map(item => item.id).join()])

    return list &&
        <Stack spacing="xs">
            <Reorder.Group axis="y" values={list} onReorder={setList} className={styles.listContainer}>
                {list.map((item, i) =>
                    <Item handleId={handleId} item={item} i={i} key={item.id} />
                )}
            </Reorder.Group >
            <Button onClick={addItem}
                size="xs" variant="subtle" compact leftIcon={<TbPlus />}>
                Add Item
            </Button>
        </Stack>
}


function Item({ handleId, item, i }) {

    const [list, setList] = useListHandle(null, handleId)

    const [inputMode] = useInputMode(null, handleId)
    const isConfig = inputMode === InputMode.Config

    const { definition } = useHandleDefinition(null, handleId)
    const isNamed = definition.listMode === ListMode.Named

    const uniqueId = `${handleId}.${item.id}`
    const isConnected = useHandleConnected(null, uniqueId)
    const { displayProps } = useNodeContext()

    const setName = name => {
        setList(list.map(i => i.id === item.id ? { ...i, name } : i))
    }

    const deleteItem = () => {
        setList(list.filter(i => i.id !== item.id))
    }

    const controls = useDragControls()

    return (
        <Reorder.Item
            value={item}
            dragListener={false}
            dragControls={controls}
        >
            <Stack spacing={5}>
                <Grid align="center" gutter={5} py={2}>

                    <Grid.Col span="content">
                        <Center w={30}>
                            {isConnected ?
                                <Tooltip label="Connected" position="left">
                                    <ThemeIcon color="green" radius="xl" size="xs">
                                        <Text size="0.65em" className="nosel">
                                            {i + 1}
                                        </Text>
                                    </ThemeIcon>
                                </Tooltip>
                                :
                                <Text align="center" color="dimmed" size="xs" className="nosel">
                                    {i + 1}
                                </Text>}
                        </Center>
                    </Grid.Col>

                    {isNamed ?
                        <Grid.Col span="auto">
                            <TextInput
                                value={item.name ?? ""}
                                onChange={event => setName(event.currentTarget.value)}
                                placeholder="Type something..."
                            />
                        </Grid.Col> :
                        <Grid.Col span="auto">
                            <Text>Item {i + 1}</Text>
                        </Grid.Col>}

                    <Grid.Col span="content">
                        <ActionIcon onPointerDown={(e) => controls.start(e)} sx={{ cursor: "grab" }}>
                            <TbGridDots />
                        </ActionIcon>
                    </Grid.Col>

                    <Grid.Col span="content">
                        <ActionIcon color="red" onClick={deleteItem}>
                            <TbX />
                        </ActionIcon>
                    </Grid.Col>
                </Grid>

                {isConfig && definition.renderConfiguration &&
                    <Box ml="xl" mb="xs">
                        <definition.renderConfiguration inputId={uniqueId} {...displayProps} />
                    </Box>}
            </Stack>
        </Reorder.Item >
    )
}


const generateId = customAlphabet(alphanumeric, 10)