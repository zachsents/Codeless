import { useListHandle } from "@minus/client-nodes/hooks/nodes"
import Handle from "./Handle"


export default function ListHandle({ id, ...props }) {

    const [list] = useListHandle(null, id)

    return list?.map(item => {
        const uniqueId = `${id}.${item.id}`
        return <Handle id={uniqueId} label={item.name} {...props} key={uniqueId} />
    })
}
