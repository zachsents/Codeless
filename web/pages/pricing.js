import { Badge, Box, Button, Card, Center, Group, SegmentedControl, SimpleGrid, Space, Stack, Text, Title, useMantineTheme } from "@mantine/core"
import Header from "@web/components/landing/Header"
import Section from "@web/components/Section"
import Footer from "@web/components/landing/Footer"
import { useQueryParam } from "@web/modules/hooks"
import { jc } from "@web/modules/util"
import { TbCheck, TbSquare, TbStack, TbStack2, TbStack3 } from "react-icons/tb"


export default function PricingPage() {

    const theme = useMantineTheme()
    const [paymentFreq, setPaymentFreq] = useQueryParam("freq", "annual", true)

    return (
        <>
            <Header />

            <main>
                <Section size="xs" p="xl" stack>
                    <Title order={1} align="center">
                        A plan for everyone
                    </Title>

                    <Text align="center" size="lg" color={theme.other.halfDimmed}>
                        We offer a variety of plans to suit your needs. Whether you're a small business owner or a titan of enterprise, we've got you covered.
                    </Text>

                    <Text align="center" color="dimmed">
                        Plans are charged per app.
                    </Text>

                    <SegmentedControl
                        data={paymentFrequencies}
                        value={paymentFreq}
                        onChange={setPaymentFreq}
                    />
                </Section>

                <Section p="xl" mt="2.5rem">
                    <SimpleGrid cols={4} breakpoints={[
                        { maxWidth: "lg", cols: 3 },
                        { maxWidth: "md", cols: 2 },
                        { maxWidth: "sm", cols: 1, verticalSpacing: "3rem" },
                    ]}>
                        <PlanCard annual={paymentFreq == "annual"} plan="free" />
                        <PlanCard annual={paymentFreq == "annual"} plan="starter" emph />
                        <PlanCard annual={paymentFreq == "annual"} plan="professional" />
                        <PlanCard annual={paymentFreq == "annual"} plan="business" />
                    </SimpleGrid>
                </Section>


                <Space h="5rem" />

                <Footer />
            </main>
        </>
    )
}

const paymentFrequencies = [
    { value: "monthly", label: "Monthly" },
    { value: "annual", label: "Annual" },
]

const features = {
    workflows: num => `${num} workflows`,
    runs: num => `${num} runs per workflow per day`,
    level1: ["Access to Level 1 Nodes", "Basic nodes for simple automations"],
    level2: ["Access to Level 2 Nodes", "SMS, Gmail, & more"],
    level3: ["Access to Level 3 Nodes", "ChatGPT & more"],
    testingTools: ["Testing Tools", "View runs & inspect inputs/outputs"],
    earlyAccess: ["Early access to new features", "We're constantly adding new features"],
    dedicatedSupport: "Dedicated support channel",
    direction: ["Steer the ship", "Join our planning sessions and help shape the future of the platform"]
}

const plans = {
    free: {
        title: "Free",
        subtitle: "Build simple automations and get a feel for the tool.",
        icon: TbSquare,
        monthlyPrice: 0,
        annualPrice: 0,
        features: [features.workflows(3), features.runs(50), features.level1],
    },
    starter: {
        title: "Starter",
        subtitle: "Build advanced automations with more workflows.",
        icon: TbStack,
        monthlyPrice: 35,
        annualPrice: 29,
        features: [features.workflows(10), features.runs(100), features.level1, features.level2, features.testingTools],
    },
    professional: {
        title: "Pro",
        subtitle: "Access to the most advanced features.",
        icon: TbStack2,
        monthlyPrice: 115,
        annualPrice: 99,
        features: [features.workflows(25), features.runs(250), features.level1, features.level2, features.level3, features.testingTools, features.earlyAccess, features.dedicatedSupport],
    },
    business: {
        title: "Business",
        subtitle: "More automations than you can shake a stick at.",
        icon: TbStack3,
        monthlyPrice: 350,
        annualPrice: 299,
        features: [features.workflows(100), features.runs(1000), features.level1, features.level2, features.level3, features.testingTools, features.earlyAccess, features.dedicatedSupport, features.direction],
    },
}

function PlanCard({ plan: planKey, emph = false, annual = false }) {

    const theme = useMantineTheme()
    const { title, subtitle, monthlyPrice, annualPrice, features } = plans[planKey]
    const isFree = monthlyPrice == 0

    const [, setSelectedPlan] = useQueryParam("upgrade_app")

    return (
        <Stack className={jc("relative", emph && "scale-105")}>
            {emph &&
                <Center p="xs" w="100%" className="absolute bottom-full">
                    <Badge>
                        Recommended
                    </Badge>
                </Center>}

            <Card withBorder shadow={emph ? "sm" : "xs"}>
                <Stack h="15rem" justify="space-between">
                    <Box>
                        <Group >
                            <Title order={emph ? 2 : 3} color={emph ? theme.primaryColor : theme.other.halfDimmed}>
                                {title}
                            </Title>
                        </Group>
                        <Text size="sm" color={emph ? theme.other.halfDimmed : "dimmed"} weight={400}>
                            {subtitle}
                        </Text>
                    </Box>

                    <Box>
                        <Button
                            fullWidth radius="xl" size="xs" variant={emph ? "filled" : "light"}
                            onClick={() => setSelectedPlan(planKey)}
                        >
                            {isFree ? "Start Now" : "Upgrade an App"}
                        </Button>

                        <Space h="xl" />

                        <Text size="2.5rem" weight={600} color={emph ? "dark" : theme.other.halfDimmed} mb={-8}>
                            ${annual ? annualPrice : monthlyPrice}
                        </Text>
                        <Text color="dimmed" size="sm">
                            per month{annual ? ", billed annually" : ""}
                        </Text>
                    </Box>
                </Stack>
            </Card>

            <Stack spacing="0.5rem" pr="sm">
                {features.map((feat, i) =>
                    <Group spacing="sm" align="flex-start" noWrap key={i}>
                        <Text color={theme.fn.primaryColor()}>
                            <TbCheck />
                        </Text>

                        {typeof feat === "string" ?
                            <Text className="flex-1" size="sm">{feat}</Text> :
                            <Box className="flex-1">
                                <Text size="sm">{feat[0]}</Text>
                                <Text size="xs" color="dimmed">{feat[1]}</Text>
                            </Box>}
                    </Group>
                )}
            </Stack>
        </Stack>
    )
}