import Number from "./basics/Number.js"
import Text from "./basics/Text.js"
import DateTime from "./basics/DateTime.js"

import RandomNumber from "./math/RandomNumber.js"
import Sum from "./math/Sum.js"
import Multiply from "./math/Multiply.js"
import Divide from "./math/Divide.js"
import Average from "./math/Average.js"

import Bind from "./util/Bind.js"
import Unbind from "./util/Unbind.js"
import Print from "./util/Print.js"
import Memo from "./util/Memo.js"
import ScheduleFlow from "./util/ScheduleFlow.js"
import RunFlow from "./util/RunFlow.js"
import Repeat from "./util/Repeat.js"
import TestMail from "./util/TestMail.js"


const nodes = [
    Number, Text, DateTime,

    RandomNumber, Sum, Multiply, Divide, Average,

    Bind, Unbind, Print, Memo, ScheduleFlow, RunFlow, Repeat, TestMail,
]

export default Object.fromEntries(nodes.map(node => [node.id, node]))