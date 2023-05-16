import { Text } from "@mantine/core"
import { jc } from "@web/modules/util"
import Link from "next/link"

export default function WhiteLogo({ href = "/", linkProps = {}, className = "", ...props }) {

    return (
        <Link href={href} {...linkProps}>
            <Text
                size="2rem" color="transparent" weight={600}
                className={jc("sliding-color-bg bg-clip-text", className)}
                {...props}
            >
                minus
            </Text>
        </Link>
    )
}
