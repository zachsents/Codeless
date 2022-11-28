import { CalendarTime } from "tabler-icons-react"
import { Box, NativeSelect, Select, Stack, Button } from "@mantine/core"

export default {
    name: "Schedule Flow",
    description: "Schedules a flow",
    icon: CalendarTime,
    valueTargets: ["time"],
    signalTargets: ["signal"],

    expanded: ({ state, setState }) => {

        return (
            <Stack spacing="xs" >
                <Button onClick={() => console.log("doing it")}>Do it</Button>
                <NativeSelect
                    placeholder="Pick a flow"
                    data={[
                        { value: 'react', label: 'React' },
                        { value: 'ng', label: 'Angular' },
                        { value: 'svelte', label: 'Svelte' },
                        { value: 'vue', label: 'Vue' },
                    ]}
                />
            </Stack>
        )
    }
}