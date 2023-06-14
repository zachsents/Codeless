import { Stack } from "@mantine/core"
import { useReplayContext } from "@web/modules/context"
import CurrentRunCard from "./CurrentRunCard"


export default function ReplayPanel() {

    const { run } = useReplayContext()

    return !!run &&
        <Stack spacing="xxs" align="flex-end" justify="flex-start">
            <CurrentRunCard />
            {/* <CurrentNodeCard /> */}
        </Stack>
}
