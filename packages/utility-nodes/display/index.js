import Bind from "./Bind"
import Print from "./Print"
import Unbind from "./Unbind"

const Nodes = {
    "utility:Print": Print,
    "utility:Bind": Bind,
    "utility:Unbind": Unbind,
}

export default Nodes
export const PackageTitle = "Utility"
export { Settings as PackageIcon } from 'tabler-icons-react'