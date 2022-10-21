import { ActionIcon, Tooltip } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import { TbArrowBigLeft } from 'react-icons/tb'

export default function GoBackButton({ href = "/#", noMargin }) {
    return (
        <Tooltip label="Go Back" withArrow position="bottom">
            <Link href={href}>
                <ActionIcon
                    component="a"
                    size="xl"
                    variant="transparent"
                    {...(!noMargin) && { ml: -40, mt: -40 }}
                >
                    <TbArrowBigLeft fontSize={30} />
                </ActionIcon>
            </Link>
        </Tooltip>
    )
}
