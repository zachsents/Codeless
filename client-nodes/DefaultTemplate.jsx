import { Square } from "tabler-icons-react"
import TextControl from "./components/TextControl"
import { useTypeDefinition } from "./hooks/nodes"


/**
 * @typedef FlowControl
 * @property {string} id
 * @property {string} label If small is true, this will be a tooltip. Otherwise, it will be the button text.
 * @property {React.ComponentType} icon
 * @property {boolean} small If true, the control will be rendered as an ActionIcon. Otherwise, it will be rendered as a Button.
 * @property {boolean} showStatus If true, the control will show a status indicator.
 * @property {({ flow: Object, appId: string }) => Promise | void} onActivate
 */


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
 * @property {boolean} showSettingsIcon If true, the settings icon will be shown in the node header.
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
 * @property {(props: object) => void} [useNodePresent] Custom hook that is called when the node is present.
 * @property {FlowControl[]} [flowControls] List of controls that are displayed in the header of the flow editor and on the flow card.
 */


/**
 * @typedef NodeHandle
 * @property {string} id Unique input ID. Cannot match any other input or output IDs.
 * @property {string} name Name of the input. If none is provided, the ID will be formatted with title case and used as the name.
 * @property {string} description
 * @property {false | "unnamed" | "named"} listMode If false, the input will have a single handle. If "unnamed", the input will have
 * multiple handles with no names. If "named", the input will have multiple handles with names.
 * @property {number | Object[]} [defaultList] Default list of items for the input. If a number is provided, the input will have that many unnamed handles. An ID will be added to each item.
 * @property {string} listNamePlaceholder Placeholder text for the list item name input.
 * @property {React.ReactNode} [tooltip] Tooltip that is displayed when the user hovers over the input's info icon.
 * @property {boolean} showHandleIcon If true, the handle icon will be displayed.
 * @property {React.ComponentType} icon Try to use a Tabler icon if applicable.
 */


/**
 * @typedef {"handle" | "config"} NodeInputMode
 */


/**
 * @typedef NodeInput
 * @augments NodeHandle
 * @property {boolean} required If true, the input must be provided.
 * @property {NodeInputMode[]} allowedModes List of modes that the input can be used in. If "handle" is included, the input
 * can be used as a handle. If "config" is included, the input can be used as a config field. If both are included, the input
 * can be used as either a handle and a config. Default is ["handle", "config"].
 * @property {NodeInputMode} defaultMode Default mode for the input. Default is "handle".
 * @property {(props: object) => React.ReactNode} renderConfiguration Function that returns a React node that is rendered as the input's configuration.
 * @property {*} [defaultValue] Default value for the input. If the input is a handle, the default value will be ignored.
 */


/**
 * @typedef NodeOutput
 * @augments NodeHandle
 * @property {boolean} defaultShowing If true, the output will be shown by default.
 */


/**
 * @type {NodeInput}
 */
export const DefaultInput = {
    id: "default",
    description: "No description.",
    tooltip: null,
    listMode: false,
    defaultList: [],
    listNamePlaceholder: "Name",
    showHandleIcon: true,
    required: false,
    allowedModes: ["handle"],
    defaultMode: "handle",
    renderConfiguration: TextControl,
}


/**
 * @type {NodeOutput}
 */
export const DefaultOutput = {
    id: "default",
    description: "No description.",
    tooltip: null,
    listMode: false,
    defaultList: [],
    listNamePlaceholder: "Name",
    showHandleIcon: true,
    defaultShowing: true,
}


/**
 * @type {NodeTypeDefinition}
 */
export default {
    // Main Info
    id: "package:NodeName",
    name: "Node Name",
    description: "Node Description",

    // Colors, icons, etc.
    color: "primary",
    icon: Square,

    // Tags
    tags: [],
    showMainTag: true,

    // Integrations
    requiredIntegrations: [],

    // State
    defaultState: {},

    // I/O
    inputs: [],
    outputs: [],

    // Rendering
    renderName: () => useTypeDefinition().name,
    renderTextContent: false,
    renderContent: false,
    renderCard: true,
    useNodePresent: undefined,

    // Other
    trigger: false,
    creatable: true,
    deletable: true,
    flowControls: [],
    showSettingsIcon: true,
}