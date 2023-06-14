import { Button } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { TbCheck, TbCopy, TbExternalLink } from "react-icons/tb"
import { Link } from "tabler-icons-react"


export default {
    id: "basic:LinkTrigger",
    name: "When a URL is visited",
    description: "Triggered when URL is accessed.",
    icon: Link,

    tags: ["Trigger"],
    showMainTag: true,
    showSettingsIcon: false,

    inputs: [],
    outputs: [
        {
            id: "$",
            name: "Payload",
            description: "The payload of the flow run.",
            tooltip: "The payload of the flow run.",
        }
    ],

    creatable: false,
    trigger: true,
    deletable: false,

    flowControls: [
        {
            id: "copy-url",
            label: "Copy URL",
            icon: TbCopy,
            small: true,
            showStatus: true,

            render: ({ flow, buttonProps = {} }) => {

                const copy = () => {
                    navigator.clipboard.writeText(generateUrl(flow))

                    notifications.show({
                        title: "Copied!",
                        color: "green",
                        icon: <TbCheck />,
                    })
                }

                return (
                    <Button
                        leftIcon={<TbCopy />} variant="light"
                        onClick={copy}
                        {...buttonProps}
                    >
                        Copy URL
                    </Button>
                )
            }
        },
        {
            id: "open-url",
            label: "Open URL",
            icon: TbExternalLink,
            small: true,
            showStatus: false,

            render: ({ flow, buttonProps = {} }) => {

                const openInNewTab = () => {
                    window.open(generateUrl(flow), "_blank")
                }

                return (
                    <Button
                        leftIcon={<TbExternalLink />} variant="light"
                        onClick={openInNewTab}
                        {...buttonProps}
                    >
                        Open URL
                    </Button>
                )
            }
        },
    ],
}


function generateUrl(flow) {
    return `${process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL}/flow-runFromUrl?flow_id=${flow.id}`
}