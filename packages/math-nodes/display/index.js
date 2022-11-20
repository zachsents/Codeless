import RandomNumber from "./RandomNumber"
import Sum from "./Sum"
import Multiply from "./Multiply"

const Nodes = {
    "math:RandomNumber": RandomNumber,
    "math:Sum": Sum,
    "math:Multiply": Multiply,
}

export default Nodes
export const PackageTitle = "Math"
export { Math as PackageIcon } from 'tabler-icons-react'