import { CircleSquare, Settings, Math, ListSearch, Icons } from "tabler-icons-react"
import { SiGooglesheets } from "react-icons/si"

import DateTime from "./basics/DateTime"
import Number from "./basics/Number"
import Text from "./basics/Text"

import RandomNumber from "./math/RandomNumber"
import Sum from "./math/Sum"
import Multiply from "./math/Multiply"
import Divide from "./math/Divide"
import Average from "./math/Average"

import Bind from "./util/Bind"
import Print from "./util/Print"
import Unbind from "./util/Unbind"
import Memo from "./util/Memo"
import ScheduleFlow from "./util/ScheduleFlow"
import Repeat from "./util/Repeat"
import TestMail from "./util/TestMail"
import RunFlow from "./util/RunFlow"
import Delay from "./util/Delay"

import ReadProperty from "./object/ReadProperty"
import ConditionalValue from "./basics/ConditionalValue"
import ConditionalSignal from "./basics/ConditionalSignal"
import And from "./basics/And"
import Or from "./basics/Or"
import Not from "./basics/Not"
import Equal from "./basics/Equal"
import NotEqual from "./basics/NotEqual"
import GreaterThan from "./basics/GreaterThan"
import Switch from "./basics/Switch"
import CreateObject from "./object/CreateObject"
import WriteProperty from "./object/WriteProperty"

import Range from "./google/sheets/Range"
import CellRange from "./google/sheets/CellRange"
import RowRange from "./google/sheets/RowRange"
import ColumnRange from "./google/sheets/ColumnRange"
import GetRange from "./google/sheets/GetRange"
import SetRange from "./google/sheets/SetRange"
import ClearRange from "./google/sheets/ClearRange"
import AppendValues from "./google/sheets/AppendValues"
import GetSheet from "./google/sheets/GetSheet"
import GetNamedColumn from "./google/sheets/GetNamedColumn"
import SetNamedColumn from "./google/sheets/SetNamedColumn"

import FilterBlanks from "./lists/FilterBlanks"
import Transpose from "./lists/Transpose"
import Size from "./lists/Size"


export const Nodes = {
    "primitive:Number": Number,
    "primitive:Text": Text,
    "primitive:Switch": Switch,
    "primitive:DateTime": DateTime,
    "basic:ConditionalValue": ConditionalValue,
    "basic:ConditionalSignal": ConditionalSignal,
    "basic:And": And,
    "basic:Or": Or,
    "basic:Not": Not,
    "basic:Equal": Equal,
    "basic:NotEqual": NotEqual,
    "basic:GreaterThan": GreaterThan,

    "object:CreateObject": CreateObject,
    "object:ReadProperty": ReadProperty,
    "object:WriteProperty": WriteProperty,

    "math:RandomNumber": RandomNumber,
    "math:Sum": Sum,
    "math:Multiply": Multiply,
    "math:Divide": Divide,
    "math:Average": Average,

    "utility:Print": Print,
    "utility:Bind": Bind,
    "utility:Unbind": Unbind,
    "utility:Memo": Memo,
    "utility:ScheduleFlow": ScheduleFlow,
    "utility:RunFlow": RunFlow,
    "list:Repeat": Repeat,
    "mail:TestMail": TestMail,
    "utility:Delay": Delay,

    "googlesheets:Range": Range,
    "googlesheets:CellRange": CellRange,
    "googlesheets:RowRange": RowRange,
    "googlesheets:ColumnRange": ColumnRange,
    "googlesheets:GetRange": GetRange,
    "googlesheets:SetRange": SetRange,
    "googlesheets:ClearRange": ClearRange,
    "googlesheets:Append": AppendValues,
    "googlesheets:GetSheet": GetSheet,
    "googlesheets:GetNamedColumn": GetNamedColumn,
    "googlesheets:SetNamedColumn": SetNamedColumn,

    "list:FilterBlanks": FilterBlanks,
    "list:Transpose": Transpose,
    "list:Size": Size,
}

export const NodeCategories = {
    Basic: {
        title: "Basic",
        icon: CircleSquare,
        members: [
            "primitive:Number",
            "primitive:Text",
            "primitive:Switch",
            "primitive:DateTime",
            "basic:ConditionalValue",
            "basic:ConditionalSignal",
            "basic:And",
            "basic:Or",
            "basic:Not",
            "basic:Equal",
            "basic:NotEqual",
            "basic:GreaterThan",

            "object:CreateObject",
            "object:ReadProperty",
            "object:WriteProperty",
        ],
    },
    Lists: {
        title: "Lists",
        icon: ListSearch,
        members: [
            "list:Repeat",
            "list:FilterBlanks",
            "list:Transpose",
            "list:Size",
        ],
    },
    Math: {
        title: "Math",
        icon: Math,
        members: [
            "math:RandomNumber",
            "math:Sum",
            "math:Multiply",
            "math:Divide",
            "math:Average",
        ],
    },
    Object: {
        title: "Objects",
        icon: Icons,
        members: [
            "object:CreateObject",
            "object:ReadProperty",
            "object:WriteProperty",
        ],
    },
    GoogleSheets: {
        title: "Sheets",
        icon: SiGooglesheets,
        members: [
            "googlesheets:Range",
            "googlesheets:CellRange",
            "googlesheets:RowRange",
            "googlesheets:ColumnRange",
            "googlesheets:GetRange",
            "googlesheets:SetRange",
            "googlesheets:GetSheet",
            "googlesheets:GetNamedColumn",
            "googlesheets:SetNamedColumn",
            "googlesheets:Append",
            "googlesheets:ClearRange",
        ],
    },
    Util: {
        title: "Utility",
        icon: Settings,
        members: [
            "utility:Print",
            "utility:Bind",
            "utility:Unbind",
            "utility:Memo",
            "utility:RunFlow",
            "utility:ScheduleFlow",
            "mail:TestMail",
            "utility:Delay",
        ],
    },
}
