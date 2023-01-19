import DefaultTrigger from "./basics/triggers/Default"
import LinkTrigger from "./basics/triggers/Link"

import DateTime from "./basics/DateTime"
import Number from "./basics/Number"
import Switch from "./basics/Switch"
import Text from "./basics/Text"

import Print from "./basics/actions/Print"
import RunFlow from "./basics/actions/RunFlow"
import ScheduleFlow from "./basics/actions/ScheduleFlow"

import And from "./basics/transforms/And"
import Or from "./basics/transforms/Or"
import Equals from "./basics/transforms/Equals"
import NotEqual from "./basics/transforms/NotEqual"
import Not from "./basics/transforms/Not"
import GreaterThan from "./basics/transforms/GreaterThan"

import If from "./control/If"

import Add from "./math/transforms/Add"
import Subtract from "./math/transforms/Subtract"
import Multiply from "./math/transforms/Multiply"
import Divide from "./math/transforms/Divide"

import Average from "./math/aggregations/Average"
import Sum from "./math/aggregations/Sum"
import Product from "./math/aggregations/Product"
import RandomNumber from "./math/RandomNumber"

import Spreadsheet from "./google/sheets/Spreadsheet"

import { Run as RunIcon, Link as LinkIcon, CircleSquare, Settings, Math, ListSearch, Icons, BrandGmail, ArrowsSplit } from "tabler-icons-react"
import { SiGooglesheets } from "react-icons/si"
import Range from "./google/sheets/Range"
import Table from "./google/sheets/Table"


export const Nodes = createObject([

    // ===== Basics =====

    // Data
    Number, Text, Switch, DateTime,
    // Actions
    Print, RunFlow, ScheduleFlow,
    // Transforms
    And, Or, Equals, NotEqual, Not, GreaterThan,


    // ===== Control =====
    If,


    // ===== Math =====

    // Data
    RandomNumber,
    // Operations / Transforms
    Add, Subtract, Multiply, Divide,
    // Aggregations
    Average, Sum, Product,


    // ===== Google Sheets =====
    Spreadsheet, Range, Table,
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

            "basic:Print", 
            "basic:RunFlow", 
            "basic:ScheduleFlow",

            "basic:And",
            "basic:Or",
            "basic:Not",
            "basic:Equals",
            "basic:NotEqual",
            "basic:GreaterThan",
        ],
    },
    Control: {
        title: "Control",
        icon: ArrowsSplit,
        members: [
            "control:If",
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
}

export const Triggers = createObject([
    DefaultTrigger, LinkTrigger,
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
    // Gmail: {
    //     title: "Gmail",
    //     icon: BrandGmail,
    //     members: [
    //         "trigger:gmail:EmailReceived",
    //     ],
    // },
}


function createObject(arr) {
    return Object.fromEntries(arr.map(item => [item.id, item]))
}

