import React, { useEffect, useState } from "react"
import { Textarea, Tooltip } from "@mantine/core"

export default function AppDescriptionEditor({ updateApp, description }) {

    const [tempDescription, setTempDescription] = useState(description)

    const handleEdit = () => {
        tempDescription != null && updateApp({ description: tempDescription })
    }

    // sync with outside state
    useEffect(() => {
        setTempDescription(description)
    }, [description])

    return (
        <Tooltip label="Edit Description" position="right">
            <Textarea
                ml={-10}
                w={400}
                spellCheck={false}
                autosize
                placeholder="Write a description for your app"
                value={tempDescription ?? ""}
                onChange={event => setTempDescription(event.currentTarget.value)}
                onBlur={handleEdit}
                styles={textAreaStyles}
            />
        </Tooltip>
    )
}


const textAreaStyles = {
    input: {
        border: "none",
        backgroundColor: "transparent",
        cursor: "pointer",
        transition: "background 0.1s, color 0.1s",
        "&:hover": {
            backgroundColor: "#fff3",
        },
        "&:focus": {
            backgroundColor: "#fffa",
            cursor: "auto",
        },
        "&:not(:focus)": {
            color: "white",
        },
        "&::placeholder": {
            color: "#fff5"
        },
        "&:focus::placeholder": {
            color: "transparent",
        },
    }
}