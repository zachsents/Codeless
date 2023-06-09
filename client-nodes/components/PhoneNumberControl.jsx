import { TextInput, Select, Text, Input } from "@mantine/core"
import { useInputValue } from "../hooks/nodes"
import PhoneInput from "react-phone-number-input/input"
import "react-phone-number-input/style.css"
import { forwardRef } from "react"


export default function PhoneNumberControl({ inputId, inputProps = {} }) {

    const [value, setValue] = useInputValue(null, inputId)

    return (
        <PhoneInput
            placeholder="(303) 555-1234"
            value={value ?? ""}
            onChange={setValue}
            country="US"
            limitMaxLength
            className="text-sm px-xs py-xxs border-1 border-solid border-gray-500 rounded-md focus:outline-none focus:border-primary transition-colors placeholder:text-gray-600 placeholder:opacity-100 font-sans"
            {...(typeof inputProps === "function" ? inputProps(value) : inputProps)}
        />
    )
}

