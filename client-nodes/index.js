import { SiGooglesheets } from "react-icons/si"
import { AlphabetLatin, BracketsContain, BrandAirtable, BrandGmail, ClockPlay, Database, Link as LinkIcon, List, Math, Table as TableIcon, Variable as VariableIcon } from "tabler-icons-react"
import DefaultTemplate, { DefaultInput, DefaultOutput } from "./DefaultTemplate"
import AirTableIntegration from "./airtable/integration"
import GoogleIntegration from "./google/integration"
import rawNodeDefinitions from "./nodes-barrel.js"


const nodeDefinitions = rawNodeDefinitions
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
        title: "Time",
        icon: ClockPlay,
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
    GoogleForms: {
        title: "Google Forms",
        icon: List,
        members: [
            "googleforms:OnFormSubmission",
        ],
    },
}


export const Integrations = createObject([
    GoogleIntegration,
    AirTableIntegration,
])


function createObject(arr) {
    return Object.fromEntries(arr.map(item => [item.id, item]))
}


const TagInfo = {
    "Gmail": {
        icon: BrandGmail,
        color: "red",
    },
    "Google Sheets": {
        icon: SiGooglesheets,
        color: "green",
    },
    "AirTable": {
        icon: BrandAirtable,
        color: "blue",
    },
    "Text": {
        icon: AlphabetLatin,
    },
    "Math": {
        icon: Math,
    },
    "Advanced": {
        icon: VariableIcon,
        color: "dark",
    },
    "Lists": {
        icon: BracketsContain,
    },
    "Tables": {
        icon: TableIcon,
        color: "yellow",
    },
    "Database": {
        icon: Database,
    },
}

export const Tags = findTags(NodeDefinitions)
export const CreatableTags = findTags(CreatableNodeDefinitions)

function findTags(definitions) {
    return [...new Set(
        Object.values(definitions).flatMap(def => def.tags ?? [])
    )]
        .map(tag => ({
            id: tag,
            ...(TagInfo[tag] ?? {}),
        }))
}