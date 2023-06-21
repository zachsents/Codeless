import { useHandleDefinition, useListHandle } from "@minus/client-nodes/hooks/nodes"
import Handle from "./Handle"


export default function ListHandle({ id, component: Component = Handle, ...props }) {

    const [list] = useListHandle(null, id)
    const { definition } = useHandleDefinition(null, id)


    return list?.map((item, i) => {
        const uniqueId = `${id}.${item.id}`
        const label = item.name ?? (definition.listNameLabel ? `${definition.listNameLabel} ${i + 1}` : undefined)

        return <Component id={uniqueId} label={label} {...props} key={uniqueId} />
    })
}
