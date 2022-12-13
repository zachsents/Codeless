import { useCallback, useState } from 'react'
import { Button, Group, Loader } from '@mantine/core'
import { httpsCallable } from 'firebase/functions'
import { useAppId } from '../modules/hooks'
import { TbCheck, TbClock, TbExclamationMark, TbFaceIdError, TbMoodSad, TbRun } from 'react-icons/tb'
import { functions } from '../modules/firebase'
import LinkIcon from './LinkIcon'
import { useDisclosure } from '@mantine/hooks'
import ScheduleModal from './ScheduleModal'


export default function RunManuallyButton({ flow, includeScheduling = false }) {

    return includeScheduling ?
        <Group>
            <JustButton flow={flow} />
            <ScheduleButton flow={flow} />
        </Group>
        :
        <JustButton flow={flow} />
}

function ScheduleButton({ flow }) {

    const [scheduling, scheduleModalHandlers] = useDisclosure(false)

    return (
        <>
            <LinkIcon
                label="Schedule Flow"
                onClick={scheduleModalHandlers.open}
                radius="lg"
                variant="light"
                color=""
                size="lg"
            >
                <TbClock fontSize={18} />
            </LinkIcon>
            <ScheduleModal flow={flow} opened={scheduling} onClose={scheduleModalHandlers.close} />
        </>
    )
}

function JustButton({ flow }) {

    const appId = useAppId()

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    // run flow manually
    const runFlowManually = useCallback(() => {
        if (appId && flow.id) {

            setLoading(true)
            console.debug(`Running "${flow.name}" (${flow.id}) manually...`)

            httpsCallable(functions, "runNow")({ appId, flowId: flow.id })
                .then(({ data }) => {

                    setLoading(false)

                    if (Object.keys(data.errors ?? {}).length > 0) {
                        setError(true)
                        console.debug("😢 Returned errors:\n", data.errors)
                    }
                    else
                        setSuccess(true)

                    console.debug("Done. Here's the response:")
                    console.debug(data)

                    setTimeout(() => {
                        setError(false)
                        setSuccess(false)
                    }, 2000)
                })
        }
    }, [appId, flow.id])

    return (
        <LinkIcon
            label="Run Now"
            loading={loading}
            disabled={!(appId && flow.id)}
            onClick={success || error ? undefined : runFlowManually}
            color={success ? "green" : error ? "red" : ""}
            radius="lg"
            variant="light"
            size="lg"
        >
            {success ? <TbCheck /> : error ? <TbMoodSad /> : <TbRun />}
        </LinkIcon>
    )
}