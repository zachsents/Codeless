import { Trigger } from ".."
import HTTP from "./HTTP"
import Manual from "./Manual"


const Nodes = {
    [Trigger.HTTP]: HTTP,
    [Trigger.Manual]: Manual,
}

export default Nodes
export const PackageTitle = "Triggers"
export { CaretRight as PackageIcon } from "tabler-icons-react"