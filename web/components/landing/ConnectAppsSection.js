/* eslint-disable @next/next/no-img-element */
import { Box, Group, SimpleGrid, Text, useMantineTheme } from "@mantine/core"
import { useForceUpdate, useViewportSize } from "@mantine/hooks"
import { forwardRef, useEffect, useRef } from "react"


const ConnectionSpacing = 12

const apps = [
    { src: "/icons/airtable.svg", alt: "Airtable logo", color: "blue", children: "Airtable" },
    { src: "/icons/gmail.svg", alt: "Gmail logo", color: "red", children: "Gmail" },
    { src: "/icons/sheets.svg", alt: "Sheets logo", color: "green", children: "Google Sheets" },
    { src: "/icons/openai.svg", alt: "OpenAI logo", color: "dark", children: "ChatGPT" },
]

export default function ConnectAppsSection() {

    const theme = useMantineTheme()

    const appRefs = useRef([])

    useViewportSize()

    const forceUpdate = useForceUpdate()
    useEffect(() => {
        // Force update to redraw svg paths
        forceUpdate()
    }, [])

    return (
        <>
            <Box className="hidden lg:block" pos="relative">
                <Group position="apart" h={120} align="flex-start">
                    {apps.map((app, i) =>
                        <App {...app} align ref={el => appRefs.current[i] = el} key={i} />,
                    )}
                </Group>

                <svg width="100%" height="100%" className="absolute top-0 left-0">
                    {/* Draws a bezier curve between each app */}
                    {apps.map((_, i) => {
                        const app1 = appRefs.current[i]
                        const app2 = appRefs.current[i + 1]

                        if (app1 == null || app2 == null) return null

                        const x1 = app1.offsetLeft + app1.offsetWidth + ConnectionSpacing
                        const y1 = app1.offsetTop + app1.offsetHeight / 2
                        const x2 = app2.offsetLeft - ConnectionSpacing
                        const y2 = app2.offsetTop + app2.offsetHeight / 2
                        const xMid = (x1 + x2) / 2

                        return (
                            <path
                                d={`M ${x1} ${y1} C${xMid} ${y1}, ${xMid} ${y2}, ${x2} ${y2}`}
                                stroke={theme.colors.gray[3]}
                                strokeWidth="3"
                                strokeDasharray={10}
                                fill="none"
                                key={i}
                            />
                        )
                    })}
                </svg>
            </Box>

            {/* Responsive */}
            <SimpleGrid className="lg:hidden" cols={2} breakpoints={[
                { maxWidth: "xs", cols: 1 },
            ]}>
                {apps.map((app, i) =>
                    <App {...app} key={i} />,
                )}
            </SimpleGrid>
        </>
    )
}

const App = forwardRef(({ children, src, alt, color, align = false }, ref) => {

    return (
        <Group noWrap position="center" className={align ? "even:self-end" : ""} ref={ref}>
            <img src={src} alt={alt} className="block" height={50} />
            <Text size="lg" weight={600} color={color}>{children}</Text>
        </Group>
    )
})

App.displayName = "App"