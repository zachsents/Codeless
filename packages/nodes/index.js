import Number from "./basics/Number.js"
import Text from "./basics/Text.js"
import Switch from "./basics/Switch.js"
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

import ReadProperty from "./object/ReadProperty.js"
import Conditional from "./basics/Conditional.js"
import And from "./basics/And.js"
import Or from "./basics/Or.js"
import Not from "./basics/Not.js"
import Equal from "./basics/Equal.js"
import NotEqual from "./basics/NotEqual.js"
import GreaterThan from "./basics/GreaterThan.js"
import CreateObject from "./object/CreateObject.js"
import WriteProperty from "./object/WriteProperty.js"


const nodes = [
    Number, Text, Switch, DateTime, Conditional, And, Or, Not, Equal, NotEqual, GreaterThan,

    CreateObject, ReadProperty, WriteProperty,

    RandomNumber, Sum, Multiply, Divide, Average,

    Bind, Unbind, Print, Memo, ScheduleFlow, RunFlow, Repeat, TestMail,
]

export default Object.fromEntries(nodes.map(node => [node.id, node]))