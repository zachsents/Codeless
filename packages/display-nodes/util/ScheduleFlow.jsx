import { CalendarTime } from "tabler-icons-react"
import { Select } from "@mantine/core"
import { collection, documentId, getDocs, query, where } from "firebase/firestore"
import { useState, useEffect } from "react"


export default {
    name: "Schedule Flow",
    description: "Schedules a flow",
    icon: CalendarTime,
    valueTargets: ["time"],
    signalTargets: ["signal"],

    configuration: ({ state, setState, appId, flowId, firestore }) => {

        // grab schedulable flows that aren't this one
        const [otherFlows, setOtherFlows] = useState([])
        useEffect(() => {
            appId && flowId &&
                getDocs(
                    query(
                        collection(firestore, `apps/${appId}/flows`),
                        where(documentId(), "!=", flowId),
                        where("trigger", "==", "trigger:manual")
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
            if (otherFlows.length == 1)
                setState({ flow: otherFlows[0].value })
        }, [otherFlows])

        return (
            <Select
                label="Flow"
                placeholder="Pick a flow"
                data={otherFlows}
                value={state.flow ?? null}
                onChange={flow => setState({ flow })}
            />
        )
    }
}