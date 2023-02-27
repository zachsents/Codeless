import { Group, Stack, Text } from "@mantine/core"
import { ArrowRight } from "tabler-icons-react"

import { useAlignHandles, useListHandle } from "@minus/graph-util"


export default function ListHandlesNodeContent({
    handleName,
    arrowSide = "in",
    emptyMessage = "Nothing specified",
    unnamedMessage = "<none>",
}) {

    const [labels] = useListHandle(null, handleName)
    const alignHandle = useAlignHandles()

    return labels?.length ?
        <Stack spacing="xs">
            {labels.map((label, i) =>
                <Group
                    position={arrowSide == "out" ? "right" : "left"}
                    spacing="xs"
                    ref={alignHandle(`${handleName}.${label.id}`)}
                    key={label.id}
                >
                    {arrowSide == "in" && <ArrowRight size={14} />}
                    <Text>
                        {label.value || (typeof unnamedMessage === "function" ? unnamedMessage(i) : unnamedMessage)}
                    </Text>
                    {arrowSide == "out" && <ArrowRight size={14} />}
                </Group>
            )}
        </Stack>
        :
        <Text size="xs" color="dimmed" align="center">{emptyMessage}</Text>
}