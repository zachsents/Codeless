import { motion } from "framer-motion"


export default function TabPanel({ children, value, activeTab }) {

    const active = value === activeTab

    return (
        <motion.div
            animate={active ? "visible" : "hidden"} {...tabAnimations} key={value}
            className={active ? "" : "pointer-events-none"}
        >
            <div className="p-sm sm:p-lg">
                {children}
            </div>
        </motion.div>
    )
}

const tabAnimations = {
    initial: "hidden",
    variants: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    },
    transition: { duration: 0.15 },
    style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
    }
}