import { Box, Group, Stack, Text } from "@mantine/core"
import { useForceUpdate, useResizeObserver } from "@mantine/hooks"
import { motion } from "framer-motion"
import { forwardRef, useEffect, useRef, useState } from "react"
import styles from "./AnimatedTabs.module.css"


export default function AnimatedTabs({
    tabs = [], defaultTab, active, onChange,
    grow = true, size = "sm", children, miw = 0, ...props
}) {

    if (active === undefined && onChange === undefined)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        [active, onChange] = useState(defaultTab ?? tabs[0])

    const activeIndex = tabs.indexOf(active)

    const widthRef = useRef(miw)
    const tabRefs = useRef({})
    const contentRefs = useRef([])

    const arrayChildren = (Array.isArray(children) ? children : [children]).filter(x => x)

    // #region Force update on mount
    const forceUpdate = useForceUpdate()
    useEffect(() => {
        forceUpdate()
    }, [])
    // #endregion

    return (
        <Stack spacing="xs" {...props} >
            <Box pos="relative" ref={el => widthRef.current = el?.offsetWidth}>
                <Group grow={grow} spacing={0}>
                    {tabs.map(tab => (
                        <Text
                            onClick={() => onChange(tab)}
                            ref={el => tabRefs.current[tab] = el}
                            align="center" size={size} weight={600} ff="Rubik" py={size}
                            tt="uppercase" color={active == tab ? "dark" : "gray"}
                            className="nosel hover:bg-gray-100 cursor-pointer rounded-sm"
                            key={tab}
                        >
                            {tab}
                        </Text>
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
                initial={{ height: 0 }}
                animate={{
                    height: contentRefs.current[activeIndex]?.offsetHeight,
                }}
                style={{ width: widthRef.current }}
                className={styles.contentWindow}
            >
                <motion.div
                    initial={{
                        x: -activeIndex * widthRef.current,
                    }}
                    animate={{
                        x: -activeIndex * widthRef.current,
                    }}
                    style={{ width: arrayChildren.length * widthRef.current }}
                    className={styles.contentContainer}
                >
                    {arrayChildren.map((child, i) =>
                        <ChildContainer
                            w={widthRef.current}
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