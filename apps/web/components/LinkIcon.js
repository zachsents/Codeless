import { ActionIcon, Tooltip } from "@mantine/core"
import Link from "next/link"

export default function LinkIcon({ children, href, label, position, radius = "md", size = "lg",
    color, variant, ...props }) {

    // default variant depends on color
    variant ??= color == "gray" ? "light" : "subtle"

    const actionIcon =
        <ActionIcon
            component={href && "a"}
            radius={radius}
            size={size}
            variant={variant}
            color={color}
            {...props}
        >
            {children}
        </ActionIcon>

    const link = href ?
        <Link href={href}>{actionIcon}</Link> : actionIcon

    return label ?
        <Tooltip label={label} position={position}>
            <div>{link}</div>
        </Tooltip>
        :
        link
}
