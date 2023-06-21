import { Text } from "@mantine/core"
import { Api, BoxSeam, CodeDots, FileArrowRight, Link, Search, Settings } from "tabler-icons-react"
import CodeControl from "../components/CodeControl"
import SlideOptionsControl from "../components/SlideOptionsControl"
import TextControl from "../components/TextControl"
import { useInputValue } from "../hooks/nodes"


export default {
    id: "api:MakeRequest",
    name: "Make Request",
    description: "Makes a request to a URL.",
    icon: Api,

    tags: ["APIs", "Advanced"],


    inputs: [
        {
            id: "url",
            name: "URL",
            description: "The URL to make the request to.",
            tooltip: "The URL to make the request to.",
            icon: Link,
            allowedModes: ["config", "handle"],
            defaultMode: "config",
        },
        {
            id: "method",
            description: "The HTTP method to use.",
            tooltip: "The HTTP method to use.",
            icon: Settings,
            allowedModes: ["config", "handle"],
            defaultMode: "config",
            defaultValue: "GET",
            renderConfiguration: props => <SlideOptionsControl
                {...props}
                data={["GET", "POST"]}
                inputProps={{ fullWidth: true }}
            />,
        },
        {
            id: "query",
            name: "Query Parameters",
            description: "The query parameters to send with the request.",
            tooltip: "The query parameters to send with the request.",
            icon: Search,
            listMode: "named",
            defaultList: 1,
            listNamePlaceholder: "Key",
            allowedModes: ["config", "handle"],
            defaultMode: "config",
            renderConfiguration: props => <TextControl {...props} inputProps={{
                placeholder: "Value",
            }} />,
        },
        {
            id: "body",
            description: "The body to send with the request.",
            tooltip: "The body to send with the request.",
            icon: FileArrowRight,
            allowedModes: ["config", "handle"],
            defaultMode: "config",
            renderConfiguration: props => {

                const [value] = useInputValue(null, "method")

                return value === "GET" ?
                    <Text color="dimmed" size="xs" align="center">GET requests can't have bodies</Text> :
                    <CodeControl {...props} inputProps={{
                        placeholder: "{  \"data\": \"Hello!\"  }",
                    }} />
            },
        },
        {
            id: "responseType",
            description: "How the response should be parsed. If Raw is selected, the entire response object will be returned, not just the body.",
            tooltip: "How the response should be parsed. If Raw is selected, the entire response object will be returned, not just the body.",
            icon: CodeDots,
            allowedModes: ["config", "handle"],
            defaultMode: "config",
            defaultValue: "json",
            renderConfiguration: props => <SlideOptionsControl
                {...props}
                data={[
                    { value: "json", label: "JSON" },
                    { value: "text", label: "Text" },
                    { value: "raw", label: "Raw" },
                ]}
                inputProps={{ fullWidth: true }}
            />,
        },
    ],
    outputs: [
        {
            id: "response",
            description: "The response from the request.",
            tooltip: "The response from the request.",
            icon: BoxSeam,
        },
    ],
}
