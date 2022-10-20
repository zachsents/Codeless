import { useEffect } from 'react'
import { Box, Button, Card, Group, SegmentedControl, Select, Stack, Text, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useRouter } from 'next/router'
import { TbDatabase, TbWorld, TbHandClick, TbArrowNarrowRight } from 'react-icons/tb'
import AppDashboard from '../../../../components/AppDashboard'
import GoBackButton from '../../../../components/GoBackButton'

export default function CreateFlow() {

    const { query: { appId } } = useRouter()

    const form = useForm({
        initialValues: {
            triggerType: "http"
        },
        validate: {
            name: value => !value,
            triggerType: value => !value,
            trigger: (value, values) => triggers[values.triggerType] && !value,
        },
    })

    const handleSubmit = values => {
        console.log(values)
    }

    // reset trigger value when trigger type is changed
    useEffect(() => {
        form.setFieldValue("trigger", null)
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
                            {...form.getInputProps("name")}
                            sx={{ width: 400 }}
                        />
                    </FormSubsection>
                </FormSection>
                <FormSection title="Trigger">
                    <FormSubsection label="Choose a trigger type">
                        <SegmentedControl
                            data={triggerTypes}
                            {...form.getInputProps("triggerType")}
                            styles={triggerTypesStyles}
                        />
                    </FormSubsection>
                    {triggers[form.values.triggerType] &&
                        <FormSubsection label="Choose a trigger">
                            <Select
                                placeholder="When..."
                                data={triggers[form.values.triggerType] ?? []}
                                {...form.getInputProps("trigger")}
                                sx={{ width: 400 }}
                            />
                        </FormSubsection>}
                    {form.isValid() &&
                        <Button type="submit" rightIcon={<TbArrowNarrowRight />} mt={30}>Start Building</Button>}
                </FormSection>

            </form>
        </AppDashboard>
    )
}

const triggerTypes = [
    {
        value: "http",
        label: <TriggerCard label="HTTP" icon={<TbWorld />} />
    },
    {
        value: "collection",
        label: <TriggerCard label="Collection" icon={<TbDatabase />} />
    },
    {
        value: "manual",
        label: <TriggerCard label="Manual" icon={<TbHandClick />} />
    },
]

const triggers = {
    collection: ["When an item is added", "When an item is changed"],
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

function FormSection({ title, children }) {
    return (
        <Stack align="center" mb={30}>
            <Title order={2} mb={10}>{title}</Title>
            {children}
        </Stack>
    )
}

function FormSubsection({ label, children }) {
    return <>
        <Text color="dimmed">{label}</Text>
        {children}
        {/* <Space h={10} /> */}
    </>
}