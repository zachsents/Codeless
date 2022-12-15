import "./arrayUtilities.js"

import DefaultTrigger from "./triggers/Default.js"
import LinkTrigger from "./triggers/Link.js"

import Number from "./basics/Number.js"
import Text from "./basics/Text.js"
import Switch from "./basics/Switch.js"
import DateTime from "./basics/DateTime.js"

import RandomNumber from "./math/RandomNumber.js"
import Sum from "./math/Sum.js"
import Add from "./math/Add.js"
import Multiply from "./math/Multiply.js"
import Divide from "./math/Divide.js"
import Average from "./math/Average.js"
import Product from "./math/Product.js"

import Bind from "./util/Bind.js"
import Unbind from "./util/Unbind.js"
import Print from "./util/Print.js"
import Memo from "./util/Memo.js"
import ScheduleFlow from "./util/ScheduleFlow.js"
import RunFlow from "./util/RunFlow.js"
import Repeat from "./util/Repeat.js"
import TestMail from "./util/TestMail.js"
import Delay from "./util/Delay.js"

import FilterBlanks from "./lists/FilterBlanks.js"
import Transpose from "./lists/Transpose.js"
import Size from "./lists/Size.js"

import CreateObject from "./object/CreateObject.js"
import ReadProperty from "./object/ReadProperty.js"
import WriteProperty from "./object/WriteProperty.js"

import ConditionalValue from "./basics/ConditionalValue.js"
import And from "./basics/And.js"
import Or from "./basics/Or.js"
import Not from "./basics/Not.js"
import Equal from "./basics/Equal.js"
import NotEqual from "./basics/NotEqual.js"
import GreaterThan from "./basics/GreaterThan.js"
import ConditionalSignal from "./basics/ConditionalSignal.js"

import Range from "./google/sheets/Range.js"
import CellRange from "./google/sheets/CellRange.js"
import RowRange from "./google/sheets/RowRange.js"
import ColumnRange from "./google/sheets/ColumnRange.js"
import GetRange from "./google/sheets/GetRange.js"
import SetRange from "./google/sheets/SetRange.js"
import ClearRange from "./google/sheets/ClearRange.js"
import AppendValues from "./google/sheets/AppendValues.js"
import GetSheet from "./google/sheets/GetSheet.js"
import GetNamedColumn from "./google/sheets/GetNamedColumn.js"
import SetNamedColumn from "./google/sheets/SetNamedColumn.js"

import TriggerEmailReceived from "./google/gmail/TriggerEmailReceived.js"


const nodes = [
    DefaultTrigger, LinkTrigger,

    Number, Text, Switch, DateTime, ConditionalValue, ConditionalSignal, And, Or, Not, Equal, NotEqual, GreaterThan,

    CreateObject, ReadProperty, WriteProperty,

    RandomNumber, Sum, Add, Multiply, Divide, Average, Product,

    Bind, Unbind, Print, Memo, ScheduleFlow, RunFlow, Repeat, TestMail, Delay,

    CellRange, Range, ColumnRange, RowRange, GetRange, SetRange, ClearRange, AppendValues, GetSheet, GetNamedColumn, SetNamedColumn,

    FilterBlanks, Transpose, Size,

    TriggerEmailReceived,
]

export default Object.fromEntries(nodes.map(node => [node.id, node]))