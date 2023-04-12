import Handle from "./Handle"
import { InputMode, useInputMode } from "@minus/client-nodes/hooks/nodes"

export default function InputHandle(props) {
    const [mode] = useInputMode(null, props.id)
    return mode == InputMode.Handle && <Handle {...props} />
}
