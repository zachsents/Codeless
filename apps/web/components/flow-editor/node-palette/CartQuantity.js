import { ActionIcon, Button, Group } from "@mantine/core"
import { useEffect, useState } from "react"
import { TbCheck, TbMinus, TbPlus } from "react-icons/tb"
import styles from "./NodePalette.module.css"


const MAX_QUANTITY = 10

export default function CartQuantity({ value, onChange }) {

    // stash value when turned off
    const [stashedValue, setStashedValue] = useState(1)
    useEffect(() => {
        value != 0 && setStashedValue(value)
    }, [value])

    const handleGroupClick = event => {
        event.stopPropagation()
    }

    const increment = event => onChange?.(event.ctrlKey ? MAX_QUANTITY : Math.min(MAX_QUANTITY, value + 1))
    const decrement = event => onChange?.(event.ctrlKey ? 1 : Math.max(0, value - 1))
    const toggle = () => onChange?.(value ? 0 : stashedValue)

    return (
        <Group
            spacing={3}
            noWrap
            onClick={handleGroupClick}
            className={`${styles.cartQuantity} ${value > 0 ? styles.notEmpty : ""}`}
        >
            <ActionIcon component="div" radius="xl" size="md" onClick={decrement}>
                <TbMinus size={12} />
            </ActionIcon>
            <Button
                component="div"

                color={value == 0 ? "gray" : null}
                variant={value == 0 ? "outline" : "filled"}
                size="xs"
                radius="xl"
                compact
                p={value == 1 ? 0 : undefined}

                onClick={toggle}

                sx={{
                    aspectRatio: value < 10 ? "1" : "auto",
                }}
            >
                {value == 0 ? "" : value == 1 ? <TbCheck /> : value}
            </Button>
            <ActionIcon component="div" radius="xl" size="md" onClick={increment}>
                <TbPlus size={12} />
            </ActionIcon>
        </Group>
    )
}
