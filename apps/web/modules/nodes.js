import MathNodes, { PackageTitle as MathPackageTitle, PackageIcon as MathPackageIcon } from "math-nodes/display"
import PrimitiveNodes, { PackageTitle as PrimitivePackageTitle, PackageIcon as PrimitivePackageIcon } from "primitive-nodes/display"
import UtilityNodes, { PackageTitle as UtilityPackageTitle, PackageIcon as UtilityPackageIcon } from "utility-nodes/display"
import MailNodes, { PackageTitle as MailPackageTitle, PackageIcon as MailPackageIcon } from "mail-nodes/display"
import ListNodes, { PackageTitle as ListPackageTitle, PackageIcon as ListPackageIcon } from "list-nodes/display"


import TriggerNodes from "triggers/display"


export const NodeCategories = [
    {
        label: PrimitivePackageTitle,
        icon: PrimitivePackageIcon,
        nodes: addIdToNodes(PrimitiveNodes),
    },
    {
        label: MathPackageTitle,
        icon: MathPackageIcon,
        nodes: addIdToNodes(MathNodes),
    },
    {
        label: UtilityPackageTitle,
        icon: UtilityPackageIcon,
        nodes: addIdToNodes(UtilityNodes),
    },
    {
        label: MailPackageTitle,
        icon: MailPackageIcon,
        nodes: addIdToNodes(MailNodes),
    },
    {
        label: ListPackageTitle,
        icon: ListPackageIcon,
        nodes: addIdToNodes(ListNodes),
    },
]



export const Nodes = NodeCategories.reduce((accum, current) => ({
    ...accum,
    ...current.nodes,
}), {
    ...addIdToNodes(TriggerNodes)
})

function addIdToNodes(nodesObj) {
    return Object.fromEntries(
        Object.entries(nodesObj).map(
            ([id, data]) => [id, { ...data, id, }]
        )
    )
}