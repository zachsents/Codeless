import { Title } from '@mantine/core'
import { openContextModal } from "@mantine/modals"
import { runFlow } from "@minus/client-sdk"
import { TbCalendar, TbRun } from 'react-icons/tb'
import { Run } from "tabler-icons-react"


export default {
    id: "basic:DefaultTrigger",
    name: "When the flow is ran from Minus",
    description: "Can be triggered manually, triggered by other flows, or scheduled to run later.",
    icon: Run,
    tags: ["Trigger"],
    showMainTag: false,

    inputs: [],
    outputs: [
        {
            id: "$",
            name: "Payload",
            description: "The payload of the flow run.",
            tooltip: "The payload of the flow run.",
        }
    ],

    creatable: false,
    trigger: true,
    deletable: false,

    flowControls: [
        {
            id: "run-now",
            label: "Run Now",
            icon: TbRun,
            small: true,
            showStatus: true,

            onActivate: async ({ flow }) => {

                console.debug(`Running "${flow.name}"...`)

                const { runId, finished } = await runFlow(flow.id, null)
                console.debug(`Created run ${runId}`)

                const flowRun = await finished
                console.debug("Entire Run:", flowRun)

                if (flowRun.returns.logs) {
                    console.groupCollapsed("Run Logs")
                    flowRun.returns.logs.forEach(log => console.log(log))
                    console.groupEnd()
                }

                switch (flowRun.status) {
                    case "finished-with-errors":
                    case "failed":
                        throw new Error(flowRun.status)
                }
            }
        },
        {
            id: "schedule-flow",
            label: "Run Later",
            icon: TbCalendar,
            small: true,
            showStatus: false,

            onActivate: ({ flow }) => openContextModal({
                modal: "ScheduleFlow",
                innerProps: { flowId: flow.id },
                title: <Title order={4}>Schedule "{flow.name}"</Title>,
                size: "lg",
            })
        },
    ]
}


