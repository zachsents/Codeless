import DefaultTemplate, { DefaultInput, DefaultOutput } from "./DefaultTemplate"

import CustomCode from "./basics/CustomCode"
import DateTime from "./basics/DateTime"
import Number from "./basics/Number"
import SetVariable from "./basics/SetVariable"
import Switch from "./basics/Switch"
import Text from "./basics/Text"
import UseVariable from "./basics/UseVariable"

import LoopFlow from "./basics/actions/LoopFlow"
import Print from "./basics/actions/Print"
import RunFlow from "./basics/actions/RunFlow"
import ScheduleFlow from "./basics/actions/ScheduleFlow"
import SendEmail from "./basics/actions/SendEmail"

import Count from "./basics/Count"
import And from "./basics/transforms/And"
import Equals from "./basics/transforms/Equals"
import GreaterThan from "./basics/transforms/GreaterThan"
import Not from "./basics/transforms/Not"
import NotEqual from "./basics/transforms/NotEqual"
import Or from "./basics/transforms/Or"

import If from "./control/If"

import Add from "./math/transforms/Add"
import Divide from "./math/transforms/Divide"
import Multiply from "./math/transforms/Multiply"
import Subtract from "./math/transforms/Subtract"

import RandomNumber from "./math/RandomNumber"
import Average from "./math/aggregations/Average"
import Product from "./math/aggregations/Product"
import Sum from "./math/aggregations/Sum"

import GmailReplyToEmail from "./google/gmail/ReplyToEmail"
import GmailSendEmail from "./google/gmail/SendEmail"

import Range from "./google/sheets/Range"
import Spreadsheet from "./google/sheets/Spreadsheet"
import Table from "./google/sheets/Table"

import AddRow from "./tables/AddRow"
import DeleteRows from "./tables/DeleteRows"
import FindRows from "./tables/FindRows"
import FindRowsByField from "./tables/FindRowsByField"
import GetField from "./tables/GetField"
import TableField from "./tables/TableField"
import UpdateRows from "./tables/UpdateRows"

import AskGPT3 from "./openai/AskGPT3"
import Classify from "./openai/Classify"
import Parse from "./openai/Parse"
import Rate from "./openai/Rate"

import { BrandGmail, Link as LinkIcon, Run as RunIcon } from "tabler-icons-react"

import Template from "./basics/Template"
import Ternary from "./basics/Ternary"
import Extract from "./text/Extract"
import IntlJoin from "./text/IntlJoin"
import Join from "./text/Join"
import Length from "./text/Length"
import Regex from "./text/Regex"
import Remove from "./text/Remove"
import Replace from "./text/Replace"
import TextAround from "./text/TextAround"
import TextContains from "./text/TextContains"
import TextMatchesRegex from "./text/TextMatchesRegex"
import TrimWhitespace from "./text/TrimWhitespace"

import ATUseTable from "./airtable/UseTable"

import AirTableIntegration from "./airtable/integration"
import ListRepeat from "./basics/ListRepeat"
import GmailIntegration from "./google/gmail/integration"
import GoogleSheetsIntegration from "./google/sheets/integration"
import DefaultTrigger from "./basics/triggers/Default"
import LinkTrigger from "./basics/triggers/Link"
import EmailReceivedTrigger from "./google/gmail/triggers/EmailReceived"


const nodeDefinitions = [

    // Triggers
    DefaultTrigger, LinkTrigger, EmailReceivedTrigger,

    // ===== Basics =====

    // Data
    Number, Text, Switch, DateTime, Template, SetVariable, UseVariable, CustomCode,
    // Actions
    Print, RunFlow, ScheduleFlow, LoopFlow, SendEmail,
    // Transforms
    And, Or, Equals, NotEqual, Not, GreaterThan,
    // Lists
    Count, ListRepeat,


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
    FindRows, FindRowsByField, AddRow, UpdateRows, DeleteRows, GetField, TableField,


    // ===== Google Sheets =====
    Spreadsheet, Range, Table,

    // ===== Gmail =====
    GmailSendEmail, GmailReplyToEmail,


    // ===== OpenAI =====
    AskGPT3, Parse, Rate, Classify,


    // ===== AirTable =====
    ATUseTable,
]
    // makes sure all nodes have default properties
    .map(node => {
        // add node definition properties
        const augmentedObj = { ...DefaultTemplate, ...node }

        // add input properties
        augmentedObj.inputs = augmentedObj.inputs.map(input => ({
            ...DefaultInput,
            // if input is a string, it's a shorthand for { id }
            ...(typeof input === "string" ? { id: input } : input)
        }))

        // add output properties
        augmentedObj.outputs = augmentedObj.outputs.map(output => ({
            ...DefaultOutput,
            // if output is a string, it's a shorthand for { id }
            ...(typeof output === "string" ? { id: output } : output)
        }))

        return augmentedObj
    })


// export different sets of nodes
export const NodeDefinitions = createObject(nodeDefinitions)
export const CreatableNodeDefinitions = createObject(nodeDefinitions.filter(node => node.creatable))
export const TriggerNodeDefinitions = createObject(nodeDefinitions.filter(node => node.trigger))


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


export const Integrations = createObject([
    GmailIntegration,
    GoogleSheetsIntegration,
    AirTableIntegration,
])


function createObject(arr) {
    return Object.fromEntries(arr.map(item => [item.id, item]))
}

