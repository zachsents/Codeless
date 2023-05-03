import { Box, ScrollArea, Stack } from "@mantine/core"
import { useReplayContext } from "@web/modules/context"
import CurrentNodeCard from "./CurrentNodeCard"
import CurrentRunCard from "./CurrentRunCard"
import styles from "./ReplayPanel.module.css"


export default function ReplayPanel() {

    const { run } = useReplayContext()

    return !!run &&
        <Box className={styles.container}>
            <ScrollArea.Autosize mah="100%" classNames={{
                root: styles.scrollArea,
                scrollbar: styles.scrollbar,
            }}>
                <Stack py="lg" pr="lg" align="flex-end" justify="flex-start">
                    <CurrentRunCard />
                    <CurrentNodeCard />
                </Stack>
            </ScrollArea.Autosize>
        </Box>
}
