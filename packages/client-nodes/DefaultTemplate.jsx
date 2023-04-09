import { Square } from "tabler-icons-react"

/**
 * @typedef NodeTypeDefinition
 * @property {string} id Unique node type ID. Convention is to prefix with the package name, e.g. "package:NodeName"
 * @property {string} name Name of the node. Displayed on the node if no custom rendering is provided.
 * @property {string} description 
 * @property {string} color Must be a string that corresponds to a color in the Mantine theme.
 * @property {React.ComponentType} icon Try to use a Tabler icon if applicable.
 * @property {string[]} tags Tags are used for searching and filtering nodes. The first tag is used as the main tag, which
 * is displayed on the node if no custom rendering is provided.
 * @property {boolean} showMainTag If true, the main tag is displayed on the node if no custom rendering is provided.
 * @property {boolean} trigger If true, the node will be treated as a trigger node. Trigger nodes are not deletable and
 * cannot be moved.
 * @property {boolean} creatable If true, the node can be created by the user.
 * @property {boolean} deletable If true, the node can be deleted by the user.
 * @property {string[]} requiredIntegrations List of required integrations. If the user does not have the required
 * integrations, the node will prompt the user to connect them.
 * @property {object} defaultState Default state for the node. This is the state that will be used when the node is
 * created.
 * @property {NodeInput[]} inputs
 * @property {NodeOutput[]} outputs
 * @property {false | (props: object) => React.ReactNode} renderName If false, the name will
 * not be rendered. Otherwise, the function should return a React node.
 * @property {false | (props: object) => React.ReactNode} renderTextContent If false, the
 * text content will not be rendered. Otherwise, the function should return a React node, which is rendered inside a Text component.
 * @property {false | (props: object) => React.ReactNode} renderContent If false, nothing
 * will be rendered. Otherwise, the function should return a React node, which is rendered inside the body of the Card component.
 * @property {boolean} renderCard If true, the node will be rendered inside a Card component. If false, the node will be
 * rendered inside a div.
 */


/**
 * @typedef NodeInput
 * @property {string} id Unique input ID. Convention is to prefix with the package name, e.g. "package:InputName"
 */


/**
 * @type {NodeTypeDefinition}
 */
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
    renderCard: true,
}