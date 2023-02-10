import { useState } from "react"
import { Check, MoodSad } from "tabler-icons-react"
import LinkIcon from "./LinkIcon"


export default function FlowControlButton({ icon, label, onClick, flow }) {

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    const Icon = success ? Check : error ? MoodSad : icon

    return (
        <LinkIcon
            label={label}
            onClick={success || error ? undefined : () => onClick({
                flow,
                loading, setLoading,
                success, setSuccess,
                error, setError,
            })}
            loading={loading}
            color={success ? "green" : error ? "red" : "gray"}
        >
            <Icon fontSize={18} size={18} />
        </LinkIcon>
    )
}