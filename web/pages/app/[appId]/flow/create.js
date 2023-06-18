import { ActionIcon, Box, Button, Card, Loader, SegmentedControl, Select, Space, Stack, Text, TextInput, Title, Tooltip } from "@mantine/core"
import { useForm } from "@mantine/form"
import { TriggerCategories, TriggerNodeDefinitions } from "@minus/client-nodes"
import { useCreateFlow, useFlowCountForApp, usePlan, useActionQuery } from "@minus/client-sdk"
import Section from "@web/components/Section"
import AppPageHead from "@web/components/dashboard/AppPageHead"
import Header from "@web/components/dashboard/Header"
import { AppProvider, useAppContext } from "@web/modules/context"
import { serializeGraph } from "@web/modules/graph-util"
import { useMustBeSignedIn } from "@web/modules/hooks"
import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"
import { TbArrowNarrowRight } from "react-icons/tb"
import { ArrowLeft } from "tabler-icons-react"


export default function CreateFlowPage() {

    return <AppProvider redirectOnNotExist="/apps">
        <CreateFlow />
    </AppProvider>
}

function CreateFlow() {

    useMustBeSignedIn()
    const router = useRouter()

    const { app } = useAppContext()
    const { plan } = usePlan({ ref: app?.plan })
    const { flowCount } = useFlowCountForApp(app?.id)
    const createFlow = useCreateFlow(app?.id)

    // Side-effect: redirect if user is maxed out on flows
    useEffect(() => {
        if (plan && flowCount != null && plan.flowCount <= flowCount)
            router.replace(`/app/${app?.id}`)
    }, [plan, flowCount])

    // Look up trigger types and map to data the SegmentedControl can use
    const triggerTypes = Object.entries(TriggerCategories).map(([catId, cat]) => {
        return {
            label: <TriggerCard label={cat.title} icon={<cat.icon />} />,
            value: catId,
        }
    })

    // Form hook & handlers
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

    // Submission query
    const [handleSubmit, { isFetching: isFormLoading }] = useActionQuery(async () => {
        const [{ id: newFlowId }] = await createFlow({
            name: form.values.name,
            trigger: form.values.trigger,
            initialGraph: createGraphWithTrigger(form.values.trigger),
        })
        await router.push(`/app/${app?.id}/flow/${newFlowId}/edit`)
    })

    // When trigger type is changed
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
            label: TriggerNodeDefinitions[triggerId].name,
            value: triggerId,
        }))

    }, [form.values.triggerType])


    return (
        <>
            <AppPageHead title="Create a Workflow" />

            <Header />

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Section py="xl"
                    stack stackProps={{ align: "center" }}
                    size="xs" containerProps={{ className: "relative" }}
                >

                    <div className="absolute top-0 left-0">
                        <Tooltip position="right" label="Go Back">
                            <ActionIcon onClick={router.back} variant="subtle" size="xl"><ArrowLeft /></ActionIcon>
                        </Tooltip>
                    </div>

                    <Title>New Workflow</Title>

                    <Text color="dimmed">Choose a name for your flow</Text>

                    <TextInput
                        placeholder="Handle customer email requests"
                        disabled={isFormLoading}
                        {...form.getInputProps("name")}
                        w="20rem"
                    />

                    <Space h={0} />

                    <div>
                        <Text color="dimmed" align="center">Choose a trigger</Text>
                        <Text color="dimmed" size="xs" align="center">
                            This is what will start your workflow.
                        </Text>
                    </div>

                    <SegmentedControl
                        variant=""
                        data={triggerTypes ?? []}
                        disabled={isFormLoading}
                        {...form.getInputProps("triggerType")}
                        classNames={{
                            root: "bg-transparent",
                            control: "!border-none",
                            indicator: "hidden",
                        }}
                        styles={theme => ({
                            controlActive: {
                                "& .triggerCard": {
                                    background: theme.colors.yellow[6],
                                    borderColor: theme.colors.dark[6],
                                }
                            }
                        })}
                    />

                    <Select
                        placeholder="When..."
                        disabled={isFormLoading}
                        data={triggers ?? []}
                        {...form.getInputProps("trigger")}
                        sx={{ width: 400 }}
                    />

                    <Space h={0} />

                    {form.isValid() &&
                        (isFormLoading ?
                            <Loader size="sm" /> :
                            <Button
                                type="submit" radius="xl"
                                rightIcon={<TbArrowNarrowRight />}
                            >
                                Start Building
                            </Button>)}
                </Section>
            </form>
        </>
    )
}


function TriggerCard({ label, icon }) {
    return (
        <Card h="5.5rem" miw="5.5rem" className="triggerCard ofv base-border rounded-md m-0 transition-colors">
            <Stack spacing={0} justify="center" className="h-full">
                <Box fz="xl">{icon}</Box>
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
    }])
}