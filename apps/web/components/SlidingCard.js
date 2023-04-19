import { Card } from "@mantine/core"
import { AnimatePresence, motion } from "framer-motion"


export default function SlidingCard({ opened, children, overshoot = 30, ...props }) {

    const offscreenX = `${100 + overshoot}%`

    return (
        <AnimatePresence>
            {opened &&
                <motion.div
                    initial={{ x: offscreenX }}
                    animate={{ x: 0 }}
                    exit={{ x: offscreenX }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                >
                    <Card {...props}>
                        {children}
                    </Card>
                </motion.div>}
        </AnimatePresence>
    )
}
