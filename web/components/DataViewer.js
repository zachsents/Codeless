import { Accordion, Code, Group, Text } from "@mantine/core"
import util from "util"
import styles from "./DataViewer.module.css"


export default function DataViewer({ data, topLevel = false }) {

    if (!requiresExpansion(data))
        return <Code className={styles.onlyCode}>{util.inspect(data)}</Code>

    return (
        <Accordion
            multiple chevronPosition="left"
            classNames={{
                chevron: styles.chevron,
                label: styles.label,
                content: styles.content,
                item: `${styles.item} ${topLevel ? styles.topLevel : ""}`,
                control: styles.control,
            }}
        >
            {data &&
                Object.entries(data).map(([key, value]) =>
                    <Accordion.Item value={key} key={key}>
                        <Accordion.Control className={!requiresExpansion(value) && styles.hideChevron}>
                            <Label name={key} value={value} />
                        </Accordion.Control>

                        {requiresExpansion(value) &&
                            <Accordion.Panel>
                                <DataViewer data={value} />
                            </Accordion.Panel>}
                    </Accordion.Item>
                )}
        </Accordion>
    )
}

function Label({ name, value }) {

    return <Group>
        <Text weight={600}>{name}</Text>
        {requiresExpansion(value) ?
            <Text color="dimmed" size="xs">Click to expand</Text> :
            <Code>{util.inspect(value)}</Code>}
    </Group>
}


function requiresExpansion(value) {
    return typeof value == "object" && value !== null
}

DataViewer.requiresExpansion = requiresExpansion