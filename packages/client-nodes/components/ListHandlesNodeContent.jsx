import { Group, Stack, Text } from "@mantine/core"
import { ArrowRight } from "tabler-icons-react"


export default function ListHandlesNodeContent({
    handleName,
    listHandles,
    alignHandles,
    state,
    arrowSide = "in",
    emptyMessage = "Nothing specified",
    unnamedMessage = "<none>",
    stateKey = "dataLabels",
}) {

    const numberOfItems = listHandles.handles?.[handleName] ?? 0

    return numberOfItems ?
        <Stack spacing="xs">
            {Array(numberOfItems).fill(0).map((_, i) =>
                <Group
                    position={arrowSide == "out" ? "right" : "left"}
                    spacing="xs"
                    ref={el => alignHandles(`${handleName}.${i}`, el)}
                    key={handleName + i}
                >
                    {arrowSide == "in" && <ArrowRight size={14} />}
                    <Text>
                        {state[stateKey]?.[i] || (typeof unnamedMessage === "function" ? unnamedMessage(i) : unnamedMessage)}
                    </Text>
                    {arrowSide == "out" && <ArrowRight size={14} />}
                </Group>
            )}
        </Stack>
        :
        <Text size="xs" color="dimmed" align="center">{emptyMessage}</Text>
}