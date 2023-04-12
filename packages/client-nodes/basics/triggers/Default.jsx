import { Title } from '@mantine/core'
import { openContextModal } from "@mantine/modals"
import { Run, Clock } from "tabler-icons-react"
import { runFlow } from "@minus/client-sdk"


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

    controls: [
        {
            label: "Run Now",
            icon: Run,

            onClick: async ({ flow, setLoading, setSuccess, setError }) => {

                setLoading(true)
                console.log(`Running "${flow.name}"...`)

                try {
                    var { runId, finished } = await runFlow(flow.id, null)

                    console.log(`Created run ${runId}`)

                    const flowRun = await finished

                    if (Object.keys(flowRun.errors).length > 0) {
                        setError(true)
                        console.log("Finished with errors.")
                    }
                    else {
                        setSuccess(true)
                        console.log("Finished successfully.")
                    }

                    if (flowRun.returns.logs) {
                        console.groupCollapsed("Run Logs")
                        flowRun.returns.logs.forEach(log => console.log(log))
                        console.groupEnd()
                    }

                    console.debug(flowRun)
                }
                catch (err) {
                    console.error("Run failed")
                    console.error(err)
                    setError(true)
                }
                finally {
                    setLoading(false)
                    setTimeout(() => {
                        setError(false)
                        setSuccess(false)
                    }, 2000)
                }
            }
        },
        {
            label: "Run Later",
            icon: Clock,

            onClick: ({ flow }) => openContextModal({
                modal: "ScheduleFlow",
                innerProps: { flowId: flow.id },
                title: <Title order={3}>Schedule "{flow.name}"</Title>,
                size: "lg",
            })
        },
    ]
}


