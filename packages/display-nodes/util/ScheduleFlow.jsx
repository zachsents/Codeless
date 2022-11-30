import { CalendarTime } from "tabler-icons-react"
import { NativeSelect, Stack } from "@mantine/core"
import { collection, documentId, getDocs, query, where } from "firebase/firestore"
import { useState, useEffect } from "react"
import { Trigger } from "triggers"


export default {
    name: "Schedule Flow",
    description: "Schedules a flow",
    icon: CalendarTime,
    valueTargets: ["time"],
    signalTargets: ["signal"],

    expanded: ({ state, setState, appId, flowId, firestore }) => {
        
        // grab schedulable flows that aren't this one
        const [otherFlows, setOtherFlows] = useState([])
        useEffect(() => {
            appId && flowId &&
                getDocs(
                    query(
                        collection(firestore, `apps/${appId}/flows`),
                        where(documentId(), "!=", flowId),
                        where("trigger", "==", Trigger.Manual)
                    )
                )
                    .then(result => {
                        setOtherFlows(result.docs.map(doc => ({
                            value: doc.id,
                            label: doc.data().name,
                        })))
                    })
        }, [appId, flowId])

        // if there's only one other flow, set it
        useEffect(() => {
            if(otherFlows.length == 1)
                setState({ flow: otherFlows[0].value })
        }, [otherFlows])

        return (
            <Stack spacing="xs" >
                <NativeSelect
                    label="Flow"
                    w={200}
                    size="xs"
                    placeholder="Pick a flow"
                    data={otherFlows}
                    value={state.flow}
                    onChange={event => setState({ flow: event.currentTarget.value })}
                />
            </Stack>
        )
    }
}