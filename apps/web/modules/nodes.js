import MathNodes, { PackageTitle as MathPackageTitle, PackageIcon as MathPackageIcon } from "math-nodes/display"

export const NodeCategories = [
    {
        label: MathPackageTitle,
        icon: MathPackageIcon,
        nodes: addIdToNodes(MathNodes),
    }
]

export const Nodes = NodeCategories.reduce((accum, current) => ({
    ...accum,
    ...current.nodes,
}), {})

function addIdToNodes(nodesObj) {
    return Object.fromEntries(
        Object.entries(nodesObj).map(
            ([id, data]) => [id, { ...data, id, }]
        )
    )
}