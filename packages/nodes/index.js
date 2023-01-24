import DefaultTrigger from "./basics/triggers/Default.js"
import LinkTrigger from "./basics/triggers/Link.js"

import DateTime from "./basics/DateTime.js"
import Number from "./basics/Number.js"
import Switch from "./basics/Switch.js"
import Text from "./basics/Text.js"
import Template from "./basics/Template.js"

import Print from "./basics/actions/Print.js"
import RunFlow from "./basics/actions/RunFlow.js"
import ScheduleFlow from "./basics/actions/ScheduleFlow.js"
import SendEmail from "./basics/SendEmail.js"

import And from "./basics/transforms/And.js"
import Or from "./basics/transforms/Or.js"
import Equals from "./basics/transforms/Equals.js"
import NotEqual from "./basics/transforms/NotEqual.js"
import Not from "./basics/transforms/Not.js"
import GreaterThan from "./basics/transforms/GreaterThan.js"

import If from "./control/If.js"
import ListLoop from "./control/ListLoop.js"

import Add from "./math/transforms/Add.js"
import Subtract from "./math/transforms/Subtract.js"
import Multiply from "./math/transforms/Multiply.js"
import Divide from "./math/transforms/Divide.js"

import Average from "./math/aggregations/Average.js"
import Sum from "./math/aggregations/Sum.js"
import Product from "./math/aggregations/Product.js"
import RandomNumber from "./math/RandomNumber.js"

import Spreadsheet from "./google/sheets/Spreadsheet.js"
import Range from "./google/sheets/Range.js"
import Table from "./google/sheets/Table.js"

import RowWhere from "./tables/RowWhere.js"
import Column from "./tables/Column.js"
import AddRow from "./tables/AddRow.js"

import AskGPT3 from "./openai/AskGPT3.js"

import TrimWhitespace from "./text/TrimWhitespace.js"


export default createObject([

    // ===== Triggers =====
    DefaultTrigger, LinkTrigger,


    // ===== Basics =====

    // Data
    Number, Text, Switch, DateTime, Template,
    // Actions
    Print, RunFlow, ScheduleFlow, SendEmail,
    // Transforms
    And, Or, Equals, NotEqual, Not, GreaterThan,


    // ===== Text =====
    TrimWhitespace,


    // ===== Control =====
    If, ListLoop,


    // ===== Math =====

    // Data
    RandomNumber,
    // Operations / Transforms
    Add, Subtract, Multiply, Divide,
    // Aggregations
    Average, Sum, Product,


    // ===== Tables =====
    RowWhere, Column, AddRow,

    // ===== Google Sheets =====
    Spreadsheet, Range, Table,


    // ===== OpenAI =====
    AskGPT3,
])



function createObject(arr) {
    return Object.fromEntries(arr.map(item => [item.id, item]))
}