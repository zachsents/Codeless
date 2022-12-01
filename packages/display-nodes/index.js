import { CircleSquare, Settings, Math, ListSearch } from "tabler-icons-react"
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
import Range from "./google/sheets/Range"
import Cell from "./google/sheets/Cell"
import GetValues from "./google/sheets/GetValues"
import ReadProperty from "./basics/ReadProperty"

export const Nodes = {
    "primitive:Number": Number,
    "primitive:Text": Text,
    "primitive:DateTime": DateTime,
    "object:ReadProperty": ReadProperty,

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

    "googlesheets:Range": Range,
    "googlesheets:Cell": Cell,
    "googlesheets:GetValues": GetValues,
}

export const NodeCategories = {
    Basic: {
        title: "Basic",
        icon: CircleSquare,
        members: [
            "primitive:Number",
            "primitive:Text",
            "primitive:DateTime",
            "object:ReadProperty",
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
            "utility:ScheduleFlow",
            "utility:RunFlow",
            "list:Repeat",
            "mail:TestMail",
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
    Lists: {
        title: "Lists",
        icon: ListSearch,
        members: [],
    },

    GoogleSheets: {
        title: "Sheets",
        icon: SiGooglesheets,
        members: [
            "googlesheets:Cell",
            "googlesheets:Range",
            "googlesheets:GetValues",
        ],
    },
}
