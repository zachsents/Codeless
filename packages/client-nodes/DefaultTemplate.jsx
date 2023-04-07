import { Square } from "tabler-icons-react"

export default {
    // Main Info
    id: "package:NodeName",
    name: "Node Name",
    description: "Node Description",

    // Colors, icons, etc.
    color: "blue",
    icon: Square,

    // Tags
    tags: [],
    showMainTag: true,

    // Other
    trigger: false,
    creatable: true,
    deletable: true,

    // Integrations
    requiredIntegrations: [],

    // State
    defaultState: {},

    // I/O
    inputs: [],
    outputs: [],

    // Rendering
    renderName: ({ typeDefinition }) => typeDefinition.name,
    renderTextContent: false,
    renderContent: false,
}