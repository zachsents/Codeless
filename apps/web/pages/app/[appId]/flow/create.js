import { useEffect, useState } from 'react'
import { Box, Button, Card, Group, Loader, SegmentedControl, Select, Stack, Text, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useRouter } from 'next/router'
import * as TbIcons from "react-icons/tb"
import { TbArrowNarrowRight } from 'react-icons/tb'
import AppDashboard from '../../../../components/AppDashboard'
import GoBackButton from '../../../../components/GoBackButton'
import { useApp, useAsyncState, useFlowCount, useFlows, usePlan } from '../../../../modules/hooks'
import { addDoc, collection, doc, query, serverTimestamp, where } from 'firebase/firestore'
import { firestore, getMappedDocs } from '../../../../modules/firebase'
import FormSubsection from '../../../../components/forms/FormSubsection'
import FormSection from '../../../../components/forms/FormSection'

export default function CreateFlow() {

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
    const [triggerTypes] = useAsyncState(async () => {
        const types = await getMappedDocs(collection(firestore, "triggerTypes"))
        return types.map(type => {
            const TypeIcon = TbIcons[type.icon]
            return {
                label: <TriggerCard label={type.name} icon={<TypeIcon />} />,
                value: type.id,
            }
        })
    })

    // form hook & handlers
    const form = useForm({
        initialValues: {
            name: "",
            triggerType: "http",
            trigger: null,
        },
        validate: {
            name: value => !value,
            triggerType: value => !value,
            trigger: value => !value,
        },
    })
    const [formLoading, setFormLoading] = useState(false)

    const handleSubmit = async values => {
        setFormLoading(true)
        const newDocRef = await addDoc(collection(firestore, "apps", appId, "flows"), {
            name: values.name,
            trigger: doc(firestore, "triggers", values.trigger),
            lastEdited: serverTimestamp(),
            created: serverTimestamp(),
            executionCount: 0,
        })
        router.push(`/app/${appId}/flow/${newDocRef.id}/edit`)
    }

    // when trigger type is changed
    const [triggers] = useAsyncState(async () => {
        // reset trigger value
        form.setFieldValue("trigger", null)

        // return empty if triggerType isn't set
        if (!form.values.triggerType)
            return

        // load triggers from database
        const loadedTriggers = await getMappedDocs(query(
            collection(firestore, "triggers"),
            where("type", "==", doc(firestore, "triggerTypes", form.values.triggerType))
        ))

        // if there's only one option, set it
        loadedTriggers.length == 1 && form.setFieldValue("trigger", loadedTriggers[0].id)

        // return data the Select component can read
        return loadedTriggers.map(trigger => ({
            label: trigger.name,
            value: trigger.id,
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