import { Tooltip, ActionIcon } from "@mantine/core"
import { TbChevronLeft, TbChevronRight } from "react-icons/tb"


export default function CollapseButton({ expanded, open, close }) {
    return (
        <Tooltip label={expanded ? "Collapse" : "Expand"} position="right">
            <ActionIcon variant="light" onClick={expanded ? close : open}>
                {expanded ? <TbChevronLeft /> : <TbChevronRight />}
            </ActionIcon>
        </Tooltip>
    )
}
