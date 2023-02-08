import DefaultTrigger from "./basics/triggers/Default"
import LinkTrigger from "./basics/triggers/Link"

import DateTime from "./basics/DateTime"
import Number from "./basics/Number"
import Switch from "./basics/Switch"
import Text from "./basics/Text"
import SetVariable from "./basics/SetVariable"
import UseVariable from "./basics/UseVariable"

import Print from "./basics/actions/Print"
import RunFlow from "./basics/actions/RunFlow"
import ScheduleFlow from "./basics/actions/ScheduleFlow"
import LoopFlow from "./basics/actions/LoopFlow"
import SendEmail from "./basics/actions/SendEmail"

import And from "./basics/transforms/And"
import Or from "./basics/transforms/Or"
import Equals from "./basics/transforms/Equals"
import NotEqual from "./basics/transforms/NotEqual"
import Not from "./basics/transforms/Not"
import GreaterThan from "./basics/transforms/GreaterThan"
import Count from "./basics/Count"

import If from "./control/If"

import Add from "./math/transforms/Add"
import Subtract from "./math/transforms/Subtract"
import Multiply from "./math/transforms/Multiply"
import Divide from "./math/transforms/Divide"

import Average from "./math/aggregations/Average"
import Sum from "./math/aggregations/Sum"
import Product from "./math/aggregations/Product"
import RandomNumber from "./math/RandomNumber"

import EmailReceivedTrigger from "./google/gmail/triggers/EmailReceived"

import Spreadsheet from "./google/sheets/Spreadsheet"
import Range from "./google/sheets/Range"
import Table from "./google/sheets/Table"

import RowWhere from "./tables/RowWhere"
import Column from "./tables/Column"
import SetColumn from "./tables/SetColumn"
import AddRow from "./tables/AddRow"

import AskGPT3 from "./openai/AskGPT3"
import Parse from "./openai/Parse"

import { Run as RunIcon, Table as TableIcon, Link as LinkIcon, CircleSquare, Math, ArrowsSplit, AlphabetLatin, BrandGmail } from "tabler-icons-react"
import { SiGooglesheets, SiOpenai } from "react-icons/si"

import TrimWhitespace from "./text/TrimWhitespace"
import Template from "./basics/Template"
import Join from "./text/Join"
import IntlJoin from "./text/IntlJoin"
import Regex from "./text/Regex"
import TextContains from "./text/TextContains"
import TextMatchesRegex from "./text/TextMatchesRegex"
import Replace from "./text/Replace"
import Remove from "./text/Remove"
import TextAround from "./text/TextAround"
import Length from "./text/Length"
import Ternary from "./basics/Ternary"
import Extract from "./text/Extract"


export const Nodes = createObject([

    // ===== Basics =====

    // Data
    Number, Text, Switch, DateTime, Template, SetVariable, UseVariable,
    // Actions
    Print, RunFlow, ScheduleFlow, LoopFlow, SendEmail,
    // Transforms
    And, Or, Equals, NotEqual, Not, GreaterThan, Count,


    // ===== Text =====
    TrimWhitespace, Join, Regex, IntlJoin, TextContains, TextMatchesRegex, Replace, Remove,
    TextAround, Length, Extract,
    

    // ===== Control =====
    If, Ternary,


    // ===== Math =====

    // Data
    RandomNumber,
    // Operations / Transforms
    Add, Subtract, Multiply, Divide,
    // Aggregations
    Average, Sum, Product,


    // ===== Tables =====
    RowWhere, Column, SetColumn, AddRow,


    // ===== Google Sheets =====
    Spreadsheet, Range, Table,


    // ===== OpenAI =====
    AskGPT3, Parse,
])

export const NodeCategories = {
    Basic: {
        title: "Basic",
        icon: CircleSquare,
        members: [
            "basic:Number",
            "basic:Text",
            "basic:Switch",
            "basic:DateTime",
            "basic:SetVariable",
            "basic:UseVariable",

            "basic:Print", 
            "basic:RunFlow", 
            "basic:ScheduleFlow",
            "basic:LoopFlow",
            "basic:SendEmail",

            "basic:And",
            "basic:Or",
            "basic:Not",
            "basic:Equals",
            "basic:NotEqual",
            "basic:GreaterThan",
            "basic:Count",
            "basic:Ternary",
        ],
    },
    Text: {
        title: "Text",
        icon: AlphabetLatin,
        members: [
            "basic:Text",
            "text:TrimWhitespace",
            "text:Join",
            "text:IntlJoin",
            "text:Regex",
            "basic:Template",
            "text:TextContains",
            "text:TextMatchesRegex",
            "text:Replace",
            "text:Remove",
            "text:TextAround",
            "text:Length",
            "text:Extract",
        ],
    },
    Control: {
        title: "Control",
        icon: ArrowsSplit,
        members: [
            "control:If",
            "basic:Ternary",
        ],
    },
    Math: {
        title: "Math",
        icon: Math,
        members: [
            "math:RandomNumber",

            "math:Add",
            "math:Subtract",
            "math:Multiply",
            "math:Divide",

            "math:Average",
            "math:Sum",
            "math:Product",
        ],
    },
    Tables: {
        title: "Tables",
        icon: TableIcon,
        members: [
            "tables:RowWhere",
            "tables:Column",
            "tables:SetColumn",
            "tables:AddRow",
        ],
    },
    GoogleSheets: {
        title: "Google Sheets",
        icon: SiGooglesheets,
        members: [
            "googlesheets:Spreadsheet",
            "googlesheets:Range",
            "googlesheets:Table",
            // "googlesheets:CellRange",
            // "googlesheets:RowRange",
            // "googlesheets:ColumnRange",
            // "googlesheets:GetRange",
            // "googlesheets:SetRange",
            // "googlesheets:GetSheet",
            // "googlesheets:GetNamedColumn",
            // "googlesheets:SetNamedColumn",
            // "googlesheets:Append",
            // "googlesheets:ClearRange",
        ],
    },
    OpenAI: {
        title: "OpenAI",
        icon: SiOpenai,
        members: [
            "openai:AskGPT3",
            "openai:Parse",
        ],
    },
}

export const Triggers = createObject([
    DefaultTrigger, LinkTrigger, EmailReceivedTrigger,
])

export const TriggerCategories = {
    Default: {
        title: "Default",
        icon: RunIcon,
        members: [
            "basic:DefaultTrigger",
        ],
    },
    Link: {
        title: "Link",
        icon: LinkIcon,
        members: [
            "basic:LinkTrigger",
        ]
    },
    Gmail: {
        title: "Gmail",
        icon: BrandGmail,
        members: [
            "gmail:EmailReceivedTrigger",
        ],
    },
}


function createObject(arr) {
    return Object.fromEntries(arr.map(item => [item.id, item]))
}

