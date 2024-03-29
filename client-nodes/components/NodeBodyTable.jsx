import { Group, Stack, Text } from "@mantine/core"
import { Fragment } from "react"


export default function NodeBodyTable({ items = [], ...props }) {
    return items.length > 0 &&
        <Stack maw="15rem" spacing="xxxs" {...props}>
            {items.map((item, i) =>
                <Fragment key={i}>
                    {/* {i != 0 &&
                        <Divider />} */}
                    <Group position="apart" noWrap spacing="xl">
                        {typeof item[0] === "string" ?
                            <Text color="dimmed" size="xs">{item[0]}</Text> :
                            item[0]}
                        {typeof item[1] === "string" ?
                            <Text weight={500} align="right" size="sm">{item[1]}</Text> :
                            item[1]}
                    </Group>
                </Fragment>
            )}
        </Stack>
}
