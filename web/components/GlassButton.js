import { Button, useMantineTheme } from "@mantine/core"
import { motion } from "framer-motion"


export default function GlassButton({ children, matchColor = false, ...props }) {

    const theme = useMantineTheme()

    return (
        <Button
            component={motion.button}
            {...buttonAnimations(theme, matchColor && props.color)}
            {...props}
        >
            {children}
        </Button>
    )
}

const Shade = 1
const buttonAnimations = (theme, matchColor) => ({
    style: {
        outlineColor: matchColor === false ?
            theme.colors.gray[Shade] :
            (theme.colors[matchColor]?.[Shade] ?? matchColor ?? theme.colors[theme.primaryColor][Shade]),
        outlineStyle: "solid",
    },
    variants: {
        idle: {
            outlineWidth: 0,
        },
        hovered: {
            outlineWidth: "0.5em",
        }
    },
    initial: "idle",
    whileHover: "hovered",
})