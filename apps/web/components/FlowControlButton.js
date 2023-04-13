import { ActionIcon, Button, Tooltip } from "@mantine/core"
import { useEffect, useState } from "react"
import { TbCheck, TbMoodSad } from "react-icons/tb"
import { useQuery } from "react-query"


export default function FlowControlButton({ flow, appId, id, label, icon, small, showStatus, onActivate, bigProps = {}, smallProps = {}, iconSize = "1.2em" }) {

    const { isLoading, isError, isSuccess, refetch } = useQuery({
        queryKey: ["flowControl", id, flow.id],
        queryFn: () => onActivate({ flow, appId }),
        enabled: false,
        retry: false,
    })

    // timeout to show status -- starts out as undefined so that it doesn't show on first render
    const [currentlyShowingStatus, setCurrentlyShowingStatus] = useState()
    useEffect(() => {
        if ((isSuccess || isError) && currentlyShowingStatus === false) {
            setCurrentlyShowingStatus(true)
            setTimeout(() => setCurrentlyShowingStatus(false), 2000)
        }
        else
            setCurrentlyShowingStatus(false)
    }, [isSuccess, isError])


    const Icon = showStatus && currentlyShowingStatus ? (isSuccess ? TbCheck : isError ? TbMoodSad : icon) : icon
    const color = showStatus && currentlyShowingStatus ? (isSuccess ? "green" : isError ? "red" : "gray") : "gray"

    return small ?
        <Tooltip label={label}>
            <ActionIcon
                onClick={() => refetch()}
                color={color} size="lg" variant="light" loading={isLoading}
                {...smallProps}
            >
                <Icon size={iconSize} />
            </ActionIcon>
        </Tooltip> :
        <Button
            onClick={() => refetch()}
            color={color} size="sm" variant="light" leftIcon={<Icon size={iconSize} />} loading={isLoading}
            {...bigProps}
        >
            {label}
        </Button>
}