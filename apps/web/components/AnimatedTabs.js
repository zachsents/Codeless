import { Box, Center, Group, Stack, Text } from "@mantine/core"
import { motion } from "framer-motion"
import { forwardRef, useEffect, useRef, useState } from "react"
import styles from "./AnimatedTabs.module.css"
import { useForceUpdate, useResizeObserver } from "@mantine/hooks"


export default function AnimatedTabs({ tabs = [], w, grow = true, size = "sm", children, ...props }) {

    const [active, setActive] = useState(tabs[0])
    const activeIndex = tabs.indexOf(active)

    const tabRefs = useRef({})
    const contentRefs = useRef([])

    const arrayChildren = Array.isArray(children) ? children : [children]

    // #region Force update on mount
    const forceUpdate = useForceUpdate()
    useEffect(() => {
        forceUpdate()
    }, [])
    // #endregion

    return (
        <Stack spacing="xs" {...props}>
            <Box pos="relative">
                <Group grow={grow} spacing={0}>
                    {tabs.map(tab => (
                        <Center
                            onClick={() => setActive(tab)}
                            px="lg" py="xs" className={styles.tabContainer} key={tab}
                            ref={el => tabRefs.current[tab] = el}
                        >
                            <Text align="center" size={size} weight={600} ff="Rubik"
                                transform="uppercase" color={active == tab ? "dark" : "gray"}
                                className="nosel">
                                {tab}
                            </Text>
                        </Center>
                    ))}
                </Group>

                <motion.div
                    animate={{
                        width: tabRefs.current[active]?.offsetWidth,
                        x: tabRefs.current[active]?.offsetLeft,
                    }}
                    className={styles.tabIndicator}
                />
            </Box>

            <motion.div
                animate={{
                    height: contentRefs.current[activeIndex]?.offsetHeight,
                }}
                style={{ width: w }}
                className={styles.contentWindow}
            >
                <motion.div
                    animate={{
                        x: -activeIndex * w,
                    }}
                    style={{ width: arrayChildren.length * w }}
                    className={styles.contentContainer}
                >
                    {arrayChildren.map((child, i) =>
                        <ChildContainer
                            w={w}
                            onResize={() => forceUpdate()}
                            ref={el => contentRefs.current[i] = el}
                            key={i}
                        >{child}</ChildContainer>
                    )}
                </motion.div>
            </motion.div>
        </Stack>
    )
}


const ChildContainer = forwardRef(({ w, children, onResize }, ref) => {

    const [resizeRef, rect] = useResizeObserver()

    useEffect(() => {
        onResize?.(rect)
    }, [rect])

    return (
        <div
            style={{ width: w }}
            ref={ref}
        >
            <div ref={resizeRef}>
                {children}
            </div>
        </div>
    )
})
ChildContainer.displayName = "ChildContainer"