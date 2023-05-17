import { Badge, Box, Button, Card, Center, Container, Grid, Group, SimpleGrid, Space, Stack, Text, Title, useMantineTheme } from "@mantine/core"
import GlassButton from "@web/components/GlassButton"
import Header from "@web/components/landing/Header"
import Section from "@web/components/Section"
import ConnectAppsSection from "@web/components/landing/ConnectAppsSection"
import FeatureTabPanel from "@web/components/landing/FeatureTabPanel"
import Footer from "@web/components/landing/Footer"
import InlineButton from "@web/components/landing/InlineButton"
import SampleFlowSvg from "@web/components/landing/SampleFlowSvg"
import { useQueryParam } from "@web/modules/hooks"
import { motion } from "framer-motion"
import Link from "next/link"
import { CodeBlock, dracula } from "react-code-blocks"
import { SiGooglesheets } from "react-icons/si"
import { TbArrowDown, TbArrowRight, TbBrandGmail, TbBrandOpenai, TbChartDots3, TbClipboardData, TbDragDrop, TbLivePhoto } from "react-icons/tb"
import { useAuthState } from "@minus/client-sdk"


export default function LandingPage() {

    const theme = useMantineTheme()

    const { isLoggedIn } = useAuthState()

    const [activeTab, setActiveTab] = useQueryParam("feature", "tables")

    return (
        <>
            <Header />

            <main>
                <Center p="xl">
                    <Link href="#">
                        <GlassButton variant="light"
                            leftIcon={<Badge variant="filled">New</Badge>}
                            rightIcon={<TbArrowRight />}
                        >
                            <Text span color={theme.other.halfDimmed}>
                                We're accepting beta testers!{" "}
                                <Text span weight={400} color={theme.other.halfDimmed}>
                                    Beta testers get free access to all paid features.
                                </Text>
                            </Text>
                        </GlassButton>
                    </Link>
                </Center>

                <Section size="xs" stack>
                    <Title order={1} align="center">
                        Automate your business,<br />
                        <SpecialHeadline>minus</SpecialHeadline>
                        {" "}the code
                    </Title>

                    <Text align="center" size="lg" color={theme.other.halfDimmed}>
                        Build powerful automations for order processing, inventory management, customer service, and more.
                    </Text>

                    <Group position="center">
                        <Link href="#features" shallow scroll={false}>
                            <Button radius="xl" rightIcon={<TbArrowDown />} variant="light">
                                See what's possible
                            </Button>
                        </Link>
                        <Link href={isLoggedIn ? "/apps" : "/login?plan"}>
                            <GlassButton radius="xl" rightIcon="🔨" matchColor>
                                Get Building
                            </GlassButton>
                        </Link>
                    </Group>
                </Section>

                <Space h="2.5rem" />

                <Section px="xl">
                    <Group align="flex-start">
                        <Card withBorder shadow="xs" p="xl" className="grid-bg flex-1">
                            <SampleFlowSvg />
                        </Card>
                        <Card w={240} withBorder shadow="sm" ml={-30} pos="relative" top={30}>
                            <Stack align="flex-start">
                                <Badge>Demo</Badge>
                                <Text>
                                    We can update our inventory in <b>Google Sheets</b> when we receive new shipping updates from <b>Gmail</b>.
                                </Text>
                                <Text color="dimmed" size="sm">
                                    <b>ChatGPT</b> extracts the tracking number from the email.
                                </Text>
                                <Group spacing="xs" w="100%" position="center">
                                    <TbBrandGmail size="2rem" strokeWidth={1.2} color={theme.colors.gray[6]} />
                                    <TbArrowRight color={theme.colors.gray[6]} />
                                    <TbBrandOpenai size="2rem" strokeWidth={1.2} color={theme.colors.gray[6]} />
                                    <TbArrowRight color={theme.colors.gray[6]} />
                                    <SiGooglesheets size="1.6rem" color={theme.colors.gray[6]} />
                                </Group>
                            </Stack>
                        </Card>
                    </Group>
                </Section>

                <Space h="5rem" />

                <Section id="features" withBorder bg="gray.1" px="xl" py="2rem">

                    <Grid align="center">
                        <Grid.Col sm={12} md={6}>
                            <Stack>
                                <Title order={2}>
                                    🔨 Build pretty much <Text span color={theme.primaryColor}>anything</Text>
                                </Title>

                                <Text mb="md">
                                    Minus offers a powerful set of <b>nodes</b> that can be used to build workflows.

                                    There are nodes for tons of common business tasks:
                                </Text>

                                <Group spacing="xs">
                                    <InlineButton active={activeTab == "tables"} onClick={() => setActiveTab("tables")}>Tables & Spreadsheets</InlineButton>
                                    <InlineButton active={activeTab == "ai"} onClick={() => setActiveTab("ai")}>AI</InlineButton>
                                    <InlineButton active={activeTab == "email"} onClick={() => setActiveTab("email")}>Email</InlineButton>
                                    <InlineButton active={activeTab == "messaging"} onClick={() => setActiveTab("messaging")}>Messaging</InlineButton>
                                    <InlineButton active={activeTab == "text"} onClick={() => setActiveTab("text")}>Text Processing</InlineButton>
                                    <InlineButton active={activeTab == "api"} onClick={() => setActiveTab("api")}>APIs</InlineButton>
                                    <InlineButton active={activeTab == "math"} onClick={() => setActiveTab("math")}>Math</InlineButton>
                                </Group>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col sm={12} md={6}>
                            <Card withBorder p={0} w="100%">
                                <Group spacing={0} align="stretch">
                                    <Box bg={theme.primaryColor} w="1.5rem"></Box>

                                    <Box pos="relative" h={240} className="flex-1">

                                        <FeatureTabPanel
                                            title="Tables & Spreadsheets"
                                            value="tables" activeTab={activeTab}
                                            subtitle="Import, query, transform, and update data with ease."
                                            text={<>
                                                Data is the lifeblood of any business. Minus makes it easy to work with data from
                                                <b> Google Sheets</b> and <b>Airtable</b>, with more integrations coming soon.
                                            </>}
                                            docsHref="#"
                                            icon="/icons/spreadsheet.svg"
                                        />

                                        <FeatureTabPanel
                                            title="AI"
                                            value="ai" activeTab={activeTab}
                                            subtitle="Leverage AI to automate the un-automatable."
                                            text={<>
                                                Before the advent of AI, certain tasks were impossible to automate. Minus makes it <b>easy to integrate AI</b> into your workflows.
                                            </>}
                                            docsHref="#"
                                            icon="/icons/ai.svg"
                                        />

                                        <FeatureTabPanel
                                            title="Email"
                                            value="email" activeTab={activeTab}
                                            subtitle="Send & receive emails from workflows."
                                            text={<>
                                                Trigger a workflow when you receive an email, or send an email when a workflow completes. Even use AI to generate the email content.
                                            </>}
                                            docsHref="#"
                                            icon="/icons/email.svg"
                                        />

                                        <FeatureTabPanel
                                            title="Messaging"
                                            value="messaging" activeTab={activeTab}
                                            subtitle="Send & receive messages from workflows."
                                            text={<>
                                                Minus makes it easy to send and receive messages via SMS, Slack, Discord, and more from your workflows. It's the perfect way to reach customers or notify your team.
                                            </>}
                                            docsHref="#"
                                            icon="/icons/chat.svg"
                                        />

                                        <FeatureTabPanel
                                            title="Text Processing"
                                            value="text" activeTab={activeTab}
                                            subtitle="Modify text, extract data, and more."
                                            text={<>
                                                Minus offers a powerful set of text processing nodes. Templates make it simple to construct custom messages from your data. If you're a wizard with regular expressions, you can use those, too.
                                            </>}
                                            docsHref="#"
                                            icon="/icons/note.svg"
                                        />

                                        <FeatureTabPanel
                                            title="APIs"
                                            value="api" activeTab={activeTab}
                                            subtitle="Use services we don't support yet."
                                            text={<>
                                                If we don't have an integration, don't stress! Minus has nodes for working with HTTP requests and raw data, allowing you to integrate with any service that has an API.
                                            </>}
                                            docsHref="#"
                                            icon="/icons/tools.svg"
                                        />

                                        <FeatureTabPanel
                                            title="Math"
                                            value="math" activeTab={activeTab}
                                            subtitle="Crunch the numbers."
                                            text={<>
                                                Minus has a set of math nodes that makes it easy to perform common calculations.
                                            </>}
                                            docsHref="#"
                                            icon="/icons/tools.svg"
                                        />
                                    </Box>
                                </Group>
                            </Card>
                        </Grid.Col>
                    </Grid>
                </Section>

                <Space h="4rem" />

                <Section size="sm" px="xl">
                    <Grid>
                        <Grid.Col sm={12} md={12}>
                            <Container size="xs">
                                <Title order={2} align="center">
                                    📝 Visual editor <Text span color={theme.primaryColor}>anyone</Text> can use
                                </Title>

                                <Text mb="md" align="center">
                                    Building workflows is as easy as drag & drop. If you can draw a flowchart, you can build an automated workflow.
                                </Text>
                            </Container>
                        </Grid.Col>

                        <Grid.Col sm={12} md={12}>
                            <SimpleGrid cols={2} spacing="xl" breakpoints={[
                                { maxWidth: "sm", cols: 1 },
                            ]}>
                                <EditorFeatureCard title="1. Drag & drop nodes" icon={TbDragDrop} src="/video/drag-n-drop.mp4">
                                    Each node represents a single task.
                                </EditorFeatureCard>
                                <EditorFeatureCard title="2. Draw connections" icon={TbChartDots3} src="/video/connect.mp4">
                                    Connect nodes to define the flow of data.
                                </EditorFeatureCard>
                                <EditorFeatureCard title="3. Go live" icon={TbLivePhoto} src="/video/go-live.mp4">
                                    Workflows are live in one click.
                                </EditorFeatureCard>
                                <EditorFeatureCard title="4. Monitor results" icon={TbClipboardData} src="/video/monitor-results.mp4">
                                    See the results of your workflows in real-time.
                                </EditorFeatureCard>
                            </SimpleGrid>
                        </Grid.Col>
                    </Grid>
                </Section>

                <Space h="4rem" />

                <Section px="xl">
                    <Card withBorder shadow="xs" px="4rem" py="2rem" className="relative dots-bg">
                        <Stack>
                            <Title order={3} align="center">
                                Connect your favorite apps
                            </Title>
                            <Text align="center" color={theme.other.halfDimmed}>
                                We're constantly working on new integrations, and we're always open to suggestions. If you don't see an integration you need,{" "}
                                <Text
                                    color={theme.primaryColor} weight={600}
                                    component="a" href="mailto:info@minuscode.app"
                                >
                                    let us know 📧
                                </Text>
                            </Text>
                            <Space h="xs" />
                            <ConnectAppsSection />
                        </Stack>

                        <Button variant="subtle" radius="xl" rightIcon={<TbArrowRight />} className="absolute top-5 right-5">
                            See All Integrations
                        </Button>
                    </Card>
                </Section>

                <Space h="4rem" />

                <Section withBorder bg="gray.9" px="xl" py="2rem">
                    <Grid align="center" spacing="xl">
                        <Grid.Col sm={12} md={6}>
                            <Stack mb="md">
                                <Group>
                                    <Title order={3} ff="JetBrains Mono" color="violet.2">
                                        Need more power?
                                    </Title>
                                    <motion.div
                                        animate={{
                                            scale: Array(5).fill([0.9, 1]).flat(),
                                            rotate: Array(5).fill([-10, 0]).flat(),
                                        }}
                                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1, type: "tween" }}
                                        style={{ fontSize: "1.4rem" }}
                                    >
                                        ⚡
                                    </motion.div>
                                </Group>
                                <Text color="gray.5">
                                    Never fear, write your own code! Minus has a <b>JavaScript node</b> that lets you write sandboxed code to do anything you want.
                                </Text>
                                <Text size="xs" color="gray.5">
                                    <b>Pro tip:</b> Code can be piped into a node just like any other data. This means you can load code from a remote source, or even run code that AI generates on the fly!
                                </Text>
                            </Stack>
                        </Grid.Col>

                        <Grid.Col sm={12} md={6}>
                            <CodeBlock
                                language="javascript"
                                showLineNumbers
                                text={`/*
* This code let's us do things that aren't possible 
* with other nodes.
*/

outputs.answer = inputs.numbers.reduce(
    (acc, curr, i) => Math.pow(
        acc, 
        i % 2 == 0 ? curr : -curr
    )
)
`}
                                theme={dracula}
                                customStyle={{
                                    borderRadius: theme.radius.md,
                                    outline: "6px solid" + theme.colors.gray[8],
                                    border: "1px solid" + theme.colors.gray[7],
                                    fontSize: "0.75rem",
                                    fontFamily: "JetBrains Mono",
                                    backgroundColor: theme.colors.dark[8],
                                }}
                            />
                        </Grid.Col>
                    </Grid>
                </Section>

                <Space h="6rem" />

                <Footer />
            </main>
        </>
    )
}



function EditorFeatureCard({ children, title, icon: Icon, src }) {

    const theme = useMantineTheme()

    return (
        <Box>
            <Card w="60%" mr="auto" withBorder shadow="xs">
                <Stack spacing="xs">
                    <Text weight={600}>
                        {title}
                    </Text>
                    <Text size="sm" color={theme.other.halfDimmed}>
                        {children}
                    </Text>
                    {Icon && <Icon size="2rem" strokeWidth={1.5} color={theme.fn.primaryColor()} />}
                </Stack>
            </Card>

            <Box
                w="80%" ml="auto" mt="-2.5rem"
                className="relative z-10 aspect-[4/3] overflow-hidden border-1 border-solid"
                sx={{
                    boxShadow: theme.shadows.sm,
                    borderRadius: theme.radius.md,
                    borderColor: theme.colors.gray[2],
                }}
            >
                <video
                    autoPlay loop muted playsInline preload="none"
                    className="object-cover"
                    style={{ width: "100%", height: "100%" }}
                >
                    <source src={src} type="video/mp4" />
                </video>
            </Box>
        </Box>
    )
}




/**
 * Made this but it's a little too extra. I'll disable it and keep it here for now.
 */
function SpecialHeadline({ children, shadows = false }) {

    const theme = useMantineTheme()

    // Scroll animation stuff
    // const { scrollYProgress } = useScroll()
    // const scrollBounds = [0, 0.05]
    // const x1 = useTransform(scrollYProgress, scrollBounds, [2, 100])
    // const x2 = useTransform(scrollYProgress, scrollBounds, [4, 200])
    // const scale = useTransform(scrollYProgress, scrollBounds, [1, 2])
    // const opacity = useTransform(scrollYProgress, scrollBounds, [1, 0])

    const x1 = 2, x2 = 4, scale = 1, opacity = 1

    // Common text props
    const textProps = { size: "1.2em", lh: 1.2, span: true }
    const overlayProps = {
        pos: "absolute", top: 0, left: 0,
        component: motion.div,
        className: "pointer-events-none",
    }

    return (
        <Box display="inline-block" pos="relative">
            {shadows && <>
                <Text {...textProps} {...overlayProps} color="yellow.4" style={{ x: x2, y: x2, scale, opacity }}>
                    {children}</Text>
                <Text {...textProps} {...overlayProps} color="pink.4" style={{ x: x1, y: x1, scale, opacity }}>
                    {children}</Text>
            </>}
            <Text {...textProps} color={theme.primaryColor} pos="relative">
                {children}</Text>
        </Box>
    )
}