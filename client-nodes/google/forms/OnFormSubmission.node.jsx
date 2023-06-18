import TextControl from "../../components/TextControl"
import { Forms, Link, List } from "tabler-icons-react"
import { useInputValue, useInternalState } from "../../hooks/nodes"
import { FORMS_URL_REGEX } from "./shared/misc"
import { useEffect } from "react"


export default {
    id: "googleforms:OnFormSubmission",
    name: "When a form is submitted",
    description: "Triggered when a form is submitted.",
    icon: List,
    color: "violet",

    tags: ["Trigger", "Google Forms"],
    showMainTag: true,

    inputs: [
        {
            id: "$formUrl",
            name: "Form URL",
            description: "The URL of the form to watch for submissions.",
            tooltip: "The URL of the form to watch for submissions.",
            icon: Link,
            allowedModes: ["config"],
            defaultMode: "config",
            renderConfiguration: ({ inputId, ...props }) => {
                const [url] = useInputValue(null, inputId)

                const isValid = url == null || FORMS_URL_REGEX.test(url)

                return <TextControl
                    inputId={inputId}
                    inputProps={{
                        error: !isValid && "This doesn't look like a valid Google Forms URL",
                    }}
                    {...props}
                />
            }
        },
    ],
    outputs: [
        {
            id: "fields",
            name: "Fields",
            description: "The fields of the form. Must match exactly what is on the form.",
            icon: Forms,
            listMode: "named",
            defaultList: 1,
        },
    ],

    requiredIntegrations: ["google"],

    creatable: false,
    trigger: true,
    deletable: false,

    useNodePresent: () => {
        const [, setState] = useInternalState()
        const [formUrl] = useInputValue(null, "$formUrl")

        // Extract Form ID when Form URL changes
        useEffect(() => {
            const [formId] = formUrl?.match(FORMS_URL_REGEX) ?? []
            setState({ formId })
        }, [formUrl])
    },
}
