import Number from "./Number"
import Text from "./Text"
import Trigger from "./Trigger"

const Nodes = {
    "primitive:Number": Number,
    "primitive:Text": Text,
    // "primitive:Trigger": Trigger,
}

export default Nodes
export const PackageTitle = "Basic"
export { CircleSquare as PackageIcon } from 'tabler-icons-react'