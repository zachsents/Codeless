import { Accordion, Code, Group, Text } from "@mantine/core"
import util from "util"
import styles from "./DataViewer.module.css"
import { Timestamp } from "firebase/firestore"


export default function DataViewer({ data, topLevel = false }) {

    if (!requiresExpansion(data))
        return <TextDisplay data={data} className={styles.onlyCode} />

    if (Array.isArray(data) && data.length == 1 && topLevel)
        return <TextDisplay data={data[0]} />

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
                Object.entries(data).map(([key, value]) => {

                    return <Accordion.Item value={key} key={key}>
                        <Accordion.Control className={!requiresExpansion(value) && styles.hideChevron}>
                            <Label
                                name={Array.isArray(data) ? (parseInt(key) + 1) : key}
                                value={value}
                            />
                        </Accordion.Control>

                        {requiresExpansion(value) &&
                            <Accordion.Panel>
                                <DataViewer data={value} />
                            </Accordion.Panel>}
                    </Accordion.Item>
                })}
        </Accordion>
    )
}

function Label({ name, value }) {

    return <Group noWrap>
        <Text weight={600}>{name}</Text>
        {requiresExpansion(value) ?
            <Text color="dimmed" size="xs">Click to expand</Text> :
            <TextDisplay data={value} />}
    </Group>
}

function TextDisplay({ data, ...props }) {

    if (typeof data === "string")
        return <Code {...props}>{data}</Code>

    if (data instanceof Timestamp)
        return <TextDisplay data={data.toDate().toLocaleString()} {...props} />

    return <Code {...props}>{util.inspect(data)}</Code>
}

function requiresExpansion(value) {
    if (value instanceof Timestamp)
        return false

    if (value == null)
        return false

    return typeof value == "object"
}

DataViewer.requiresExpansion = requiresExpansion