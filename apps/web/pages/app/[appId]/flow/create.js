import { useEffect, useMemo, useState } from "react"
import { ActionIcon, Box, Button, Card, Group, Loader, SegmentedControl, Select, Stack, Text, TextInput, Tooltip } from "@mantine/core"
import { useForm } from "@mantine/form"
import Link from "next/link"
import { useRouter } from "next/router"
import { TbArrowNarrowRight } from "react-icons/tb"
import { useAppDetailsRealtime, useCreateFlow, useFlowCountForApp, usePlan } from "@minus/client-sdk"
import { Triggers, TriggerCategories } from "@minus/client-nodes"

import { useAppId, useMustBeSignedIn } from "../../../../modules/hooks"
import { serializeGraph } from "../../../../modules/graph-util"
import AppDashboard from "../../../../components/AppDashboard"
import FormSubsection from "../../../../components/forms/FormSubsection"
import FormSection from "../../../../components/forms/FormSection"
import { ArrowLeft } from "tabler-icons-react"


export default function CreateFlow() {

    useMustBeSignedIn()
    const router = useRouter()

    const appId = useAppId()
    const [app] = useAppDetailsRealtime(appId)
    const { plan } = usePlan({ ref: app?.plan })
    const { flowCount } = useFlowCountForApp(appId)
    const createFlow = useCreateFlow(appId)

    // check if user is maxed out on flows
    useEffect(() => {
        if (plan && flowCount != null && plan.flowCount <= flowCount)
            router.push(`/app/${appId}/flows`)
    }, [plan, flowCount])

    // look up trigger types and map to data the SegmentedControl can use
    const triggerTypes = Object.entries(TriggerCategories).map(([catId, cat]) => {
        return {
            label: <TriggerCard label={cat.title} icon={<cat.icon />} />,
            value: catId,
        }
    })

    // form hook & handlers
    const form = useForm({
        initialValues: {
            name: "",
            triggerType: "Default",
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
        const { id: newFlowId } = await createFlow({
            name: values.name,
            trigger: values.trigger,
            initialGraph: createGraphWithTrigger(values.trigger),
        })
        router.push(`/app/${appId}/flow/${newFlowId}/edit`)
    }

    // when trigger type is changed
    const triggers = useMemo(() => {

        // reset trigger value
        form.setFieldValue("trigger", null)

        // return empty if triggerType isn't set
        if (!form.values.triggerType)
            return

        // if there's only one option, set it
        const triggerList = TriggerCategories[form.values.triggerType].members
        triggerList.length == 1 && form.setFieldValue("trigger", triggerList[0])

        return triggerList.map(triggerId => ({
            label: Triggers[triggerId].name,
            value: triggerId,
        }))

    }, [form.values.triggerType])


    return (
        <AppDashboard pageTitle="Create a flow" appName={app?.name}>
            <Group position="apart">
                <Link href={`/app/${appId}/flows`}>
                    <Tooltip position="right" label="Cancel">
                        <ActionIcon variant="light" size="xl"><ArrowLeft /></ActionIcon>
                    </Tooltip>
                </Link>
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
                    <FormSubsection label="Choose a trigger">
                        <Select
                            placeholder="When..."
                            disabled={formLoading}
                            data={triggers ?? []}
                            {...form.getInputProps("trigger")}
                            sx={{ width: 400 }}
                        />
                    </FormSubsection>
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
        focusable: false,
        data: { state: {} },
        state: {},
    }])
}