import { motion } from "framer-motion"
import { Group, Title, ThemeIcon } from "@mantine/core"


export default function AccordionTitle({ children, active, icon, iconProps = {}, rightSection }) {
    return (
        <motion.div
            initial={{ x: 0 }}
            animate={{ x: active ? -10 : 0 }}
        >
            <Group>
                <Title order={5}>{children}</Title>
                {icon &&
                    <ThemeIcon size="sm" radius="sm" {...iconProps}>
                        {icon}
                    </ThemeIcon>}
                {rightSection}
            </Group>
        </motion.div>
    )
}