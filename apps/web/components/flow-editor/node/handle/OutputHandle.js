import { useOutputShowing } from "@minus/client-nodes/hooks/nodes"
import Handle from "./Handle"

export default function OutputHandle(props) {
    const [showing] = useOutputShowing(null, props.id)
    return showing && <Handle {...props} />
}
