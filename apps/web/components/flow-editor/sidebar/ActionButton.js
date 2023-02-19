import { Tooltip, Button } from "@mantine/core"


export default function ActionButton({
    expanded,

    children,
    icon: Icon,
    iconSize = 24,

    label,
    tooltipProps = {},

    ...props
}) {
    return (
        <Tooltip
            label={label}
            position={expanded ? "top" : "right"}
            {...tooltipProps}
        >
            <Button
                p={0}
                fullWidth
                size="md"
                color="gray"
                variant="light"
                {...props}
            >
                {children ?? <Icon size={iconSize} />}
            </Button>
        </Tooltip>
    )
}
