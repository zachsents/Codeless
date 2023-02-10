import { Title } from '@mantine/core'
import { openContextModal } from "@mantine/modals"
import { Run, Clock } from "tabler-icons-react"
import { runFlow } from "@minus/client-sdk"


export default {
    id: "basic:DefaultTrigger",
    name: "Trigger",
    description: "Can be triggered manually, triggered by other flows, or scheduled to run later.",
    icon: Run,

    inputs: [],
    outputs: ["$"],

    deletable: false,

    controls: [
        {
            label: "Run Now",
            icon: Run,

            onClick: async ({ flow, loading, setLoading, success, setSuccess, error, setError }) => {

                setLoading(true)
                console.debug(`Running "${flow.name}" (${flow.id}) manually...`)

                try {
                    var flowRun = await runFlow(flow.id, null)

                    if (Object.keys(flowRun.errors).length > 0) {
                        setError(true)
                        console.debug("😢 Returned errors:\n", flowRun.errors)
                    }
                    else
                        setSuccess(true)

                    console.debug("Done. Here's the run:")
                    console.debug(flowRun)

                    setTimeout(() => {
                        setError(false)
                        setSuccess(false)
                    }, 2000)
                }
                catch (err) {
                    console.error("Run failed")
                    console.error(err)
                    return
                }
                finally {
                    setLoading(false)
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


