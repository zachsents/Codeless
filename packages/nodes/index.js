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
import LoopFlow from "./basics/actions/LoopFlow.js"
import SendEmail from "./basics/SendEmail.js"

import And from "./basics/transforms/And.js"
import Or from "./basics/transforms/Or.js"
import Equals from "./basics/transforms/Equals.js"
import NotEqual from "./basics/transforms/NotEqual.js"
import Not from "./basics/transforms/Not.js"
import GreaterThan from "./basics/transforms/GreaterThan.js"
import Count from "./basics/Count.js"

import If from "./control/If.js"

import Add from "./math/transforms/Add.js"
import Subtract from "./math/transforms/Subtract.js"
import Multiply from "./math/transforms/Multiply.js"
import Divide from "./math/transforms/Divide.js"

import Average from "./math/aggregations/Average.js"
import Sum from "./math/aggregations/Sum.js"
import Product from "./math/aggregations/Product.js"
import RandomNumber from "./math/RandomNumber.js"

import EmailReceivedTrigger from "./google/gmail/triggers/EmailReceived.js"

import Spreadsheet from "./google/sheets/Spreadsheet.js"
import Range from "./google/sheets/Range.js"
import Table from "./google/sheets/Table.js"

import RowWhere from "./tables/RowWhere.js"
import Column from "./tables/Column.js"
import SetColumn from "./tables/SetColumn.js"
import AddRow from "./tables/AddRow.js"

import AskGPT3 from "./openai/AskGPT3.js"
import Parse from "./openai/Parse.js"

import TrimWhitespace from "./text/TrimWhitespace.js"
import Join from "./text/Join.js"
import IntlJoin from "./text/IntlJoin.js"
import Regex from "./text/Regex.js"
import TextContains from "./text/TextContains.js"
import TextMatchesRegex from "./text/TextMatchesRegex.js"
import Replace from "./text/Replace.js"
import Remove from "./text/Remove.js"


export default createObject([

    // ===== Triggers =====
    DefaultTrigger, LinkTrigger,


    // ===== Basics =====

    // Data
    Number, Text, Switch, DateTime, Template,
    // Actions
    Print, RunFlow, ScheduleFlow, LoopFlow, SendEmail,
    // Transforms
    And, Or, Equals, NotEqual, Not, GreaterThan, Count,


    // ===== Text =====
    TrimWhitespace, Join, Regex, IntlJoin, TextContains, TextMatchesRegex, Replace, Remove,


    // ===== Control =====
    If,


    // ===== Math =====

    // Data
    RandomNumber,
    // Operations / Transforms
    Add, Subtract, Multiply, Divide,
    // Aggregations
    Average, Sum, Product,


    // ===== Tables =====
    RowWhere, Column, SetColumn, AddRow,


    // ===== Gmail =====
    EmailReceivedTrigger,


    // ===== Google Sheets =====
    Spreadsheet, Range, Table,


    // ===== OpenAI =====
    AskGPT3, Parse,
])



function createObject(arr) {
    return Object.fromEntries(arr.map(item => [item.id, item]))
}