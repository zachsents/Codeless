import RandomNumber from "./RandomNumber"
import Sum from "./Sum"
import Multiply from "./Multiply"
import Divide from "./Divide"

const Nodes = {
    "math:RandomNumber": RandomNumber,
    "math:Sum": Sum,
    "math:Multiply": Multiply,
    "math:Divide": Divide,
}

export default Nodes
export const PackageTitle = "Math"
export { Math as PackageIcon } from 'tabler-icons-react'