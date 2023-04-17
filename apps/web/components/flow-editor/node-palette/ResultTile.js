import { ActionIcon, Badge, Box, Group, Stack, Text, Tooltip, useMantineTheme } from "@mantine/core"
import { arrayRemove, arrayUnion, useUserPreferences } from "@minus/client-sdk"
import { forwardRef } from "react"
import { TbPin, TbPinnedOff } from "react-icons/tb"
import { Square } from "tabler-icons-react"
import CartQuantity from "./CartQuantity"
import styles from "./NodePalette.module.css"


const ResultTile = forwardRef(({ type, expanded, quantity, onQuantityChange, ...props }, ref) => {

    const Icon = type.icon ?? Square

    const theme = useMantineTheme()
    const mainColor = theme.colors[type.color][theme.fn.primaryShade()]
    const bgColor = type.color === "dark" ? theme.colors.gray[1] : theme.colors[type.color][0]

    // pinning
    const [preferences, setPreference] = useUserPreferences()
    const pinned = preferences.pinned?.includes(type.id)
    const togglePinned = (e) => {
        e.stopPropagation()
        setPreference("pinned", pinned ? arrayRemove(type.id) : arrayUnion(type.id))
    }
    const PinIcon = pinned ? TbPinnedOff : TbPin

    return (
        <Box
            className={`${styles.tile} ${expanded ? styles.expanded : ""}`}
            style={{ "--bgColor": bgColor, "--mainColor": mainColor }}
            {...props}
            ref={ref}
        >
            <Stack spacing="xs">
                <Group position="apart" noWrap align="start">
                    <Group noWrap>
                        <Icon color={mainColor} />
                        <Text
                            size={calculateFontSize(type.name.length)}
                            color={`${type.color}.7`}
                            ff="Rubik"
                            weight={600}
                            transform="uppercase"
                            className="nosel"
                        >
                            {type.name}
                        </Text>

                        <Tooltip label={pinned ? "Unpin" : "Pin"}>
                            <ActionIcon
                                onClick={togglePinned}
                                component="div" radius="sm" size="sm" className={styles.pin}
                            >
                                <PinIcon color={theme.colors.gray[theme.fn.primaryShade()]} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>

                    <CartQuantity value={quantity} onChange={onQuantityChange} />
                </Group>

                {type.tags.length > 0 &&
                    <Group spacing="xs">
                        {type.tags.map((tag, i) =>
                            <Badge color={i == 0 ? type.color : "gray"} radius="sm" className="nosel" key={i}>
                                {tag}
                            </Badge>
                        )}
                    </Group>}

                <Text color="dimmed" size="sm" className="nosel">
                    {type.description}
                </Text>
            </Stack>
        </Box>
    )
})
ResultTile.displayName = "NodePalette.NodeTile"

export default ResultTile



function calculateFontSize(length, {
    minLength = 15,
    maxLength = 20,
    minSize = 14,
    maxSize = 18,
} = {}) {
    return Math.max(
        minSize,
        Math.min(
            maxSize,
            (length - minLength) / (maxLength - minLength) * (minSize - maxSize) + maxSize
        )
    )
}