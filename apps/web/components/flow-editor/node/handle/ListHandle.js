import { useListHandle } from "@minus/client-nodes/hooks/nodes"
import Handle from "./Handle"


export default function ListHandle({ id, component: Component = Handle, ...props }) {

    const [list] = useListHandle(null, id)

    return list?.map(item => {
        const uniqueId = `${id}.${item.id}`
        return <Component id={uniqueId} label={item.name} {...props} key={uniqueId} />
    })
}
