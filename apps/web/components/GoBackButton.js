import { ActionIcon, Tooltip } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import { TbArrowBigLeft } from 'react-icons/tb'

export default function GoBackButton({ href = "/#", onClick, noMargin }) {

    const button = <ActionIcon
        component="a"
        size="xl"
        variant="transparent"
        onClick={onClick}
        {...(!noMargin) && { ml: -40, mt: -40 }}
    >
        <TbArrowBigLeft fontSize={30} />
    </ActionIcon>

    return (
        <Tooltip label="Go Back" withArrow position="bottom">
            {onClick ? button : <Link href={href}>{button}</Link>}
        </Tooltip>
    )
}
