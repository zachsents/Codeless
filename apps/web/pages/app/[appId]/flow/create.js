import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Card, Group, Loader, SegmentedControl, Select, Stack, Text, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useRouter } from 'next/router'
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore'
import { TbArrowNarrowRight } from 'react-icons/tb'
import * as TablerIcons from "tabler-icons-react"

import Triggers from "triggers/display"
import { TriggerCategories } from 'triggers'
import { serializeGraph } from 'node-builder'
import { firestore, useMustBeSignedIn } from '../../../../modules/firebase'
import { useApp, useFlowCount, usePlan } from '../../../../modules/hooks'
import AppDashboard from '../../../../components/AppDashboard'
import GoBackButton from '../../../../components/GoBackButton'
import FormSubsection from '../../../../components/forms/FormSubsection'
import FormSection from '../../../../components/forms/FormSection'


export default function CreateFlow() {

    useMustBeSignedIn()
    const { query: { appId }, ...router } = useRouter()

    // check if user is maxed out on flows
    const app = useApp()
    const plan = usePlan(app?.plan)
    const flowCount = useFlowCount(appId)
    useEffect(() => {
        if (plan && flowCount !== undefined && plan.flowCount <= flowCount)
            router.push(`/app/${appId}/flows`)
    }, [plan, flowCount])


    // look up trigger types and map to data the SegmentedControl can use
    const triggerTypes = Object.entries(TriggerCategories).map(([catId, cat]) => {
        const TypeIcon = TablerIcons[cat.icon]
        return {
            label: <TriggerCard label={cat.name} icon={<TypeIcon />} />,
            value: catId,
        }
    })


    // form hook & handlers
    const form = useForm({
        initialValues: {
            name: "",
            triggerType: "HTTP",
            trigger: null,
        },
        validate: {
            name: value => !value,
            triggerType: value => !value,
            trigger: value => !value,
        },
    })
    const [formLoading, setFormLoading] = useState(false)


    // submission
    const handleSubmit = async values => {
        setFormLoading(true)
        const newDocRef = await addDoc(collection(firestore, "apps", appId, "flows"), {
            name: values.name,
            trigger: values.trigger,
            lastEdited: serverTimestamp(),
            created: serverTimestamp(),
            executionCount: 0,
            graph: createGraphWithTrigger(values.trigger)
        })
        router.push(`/app/${appId}/flow/${newDocRef.id}/edit`)
    }


    // when trigger type is changed
    const triggers = useMemo(() => {

        // reset trigger value
        form.setFieldValue("trigger", null)

        // return empty if triggerType isn't set
        if (!form.values.triggerType)
            return

        // if there's only one option, set it
        const triggerList = TriggerCategories[form.values.triggerType].triggers
        triggerList.length == 1 && form.setFieldValue("trigger", triggerList[0])

        return triggerList.map(triggerId => ({
            label: Triggers[triggerId].name,
            value: triggerId,
        }))

    }, [form.values.triggerType])


    return (
        <AppDashboard>
            <Group position="apart">
                <GoBackButton href={`/app/${appId}/flows`} />
            </Group>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <FormSection title="New Flow">
                    <FormSubsection label="Choose a name for your flow">
                        <TextInput
                            placeholder="Launches a rocket when a link is clicked"
                            disabled={formLoading}
                            {...form.getInputProps("name")}
                            sx={{ width: 400 }}
                        />
                    </FormSubsection>
                </FormSection>
                <FormSection title="Trigger">
                    <FormSubsection label="Choose a trigger type">
                        <SegmentedControl
                            data={triggerTypes ?? []}
                            disabled={formLoading}
                            {...form.getInputProps("triggerType")}
                            styles={triggerTypesStyles}
                        />
                    </FormSubsection>
                    {triggers?.length > 1 &&
                        <FormSubsection label="Choose a trigger">
                            <Select
                                placeholder="When..."
                                disabled={formLoading}
                                data={triggers ?? []}
                                {...form.getInputProps("trigger")}
                                sx={{ width: 400 }}
                            />
                        </FormSubsection>}
                </FormSection>
                <FormSection>
                    {form.isValid() ?
                        formLoading ?
                            <Loader size="sm" /> :
                            <Button type="submit" rightIcon={<TbArrowNarrowRight />}>Start Building</Button>
                        :
                        <></>
                    }
                </FormSection>
            </form>
        </AppDashboard>
    )
}


const triggerTypesStyles = theme => ({
    root: {
        backgroundColor: "transparent",
    },
    active: { display: "none", },
    control: { border: "none !important" },
    label: {
        // padding: 2,
    },
    labelActive: {
        "& .triggerCard": {
            outline: "3px solid " + theme.colors[theme.primaryColor][theme.primaryShade.light]
        }
    },
})

function TriggerCard({ label, icon }) {
    return (
        <Card radius="md" m={0} withBorder className="triggerCard" sx={{
            overflow: "visible",
            width: 110,
            height: 110,
        }}>
            <Stack spacing={0} justify="center" sx={{ height: "100%" }}>
                <Box sx={{ fontSize: 28 }}>{icon}</Box>
                <Text>{label}</Text>
            </Stack>
        </Card>
    )
}

function createGraphWithTrigger(trigger) {
    return serializeGraph([{
        id: "trigger",
        type: trigger,
        position: { x: 0, y: 0 },
        draggable: false,
        deletable: false,
        data: { state: {} },
        state: {},
    }])
}