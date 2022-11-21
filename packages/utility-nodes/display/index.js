import Bind from "./Bind"
import Print from "./Print"
import Unbind from "./Unbind"
import Memo from "./Memo"

const Nodes = {
    "utility:Print": Print,
    "utility:Bind": Bind,
    "utility:Unbind": Unbind,
    "utility:Memo": Memo,
}

export default Nodes
export const PackageTitle = "Utility"
export { Settings as PackageIcon } from 'tabler-icons-react'