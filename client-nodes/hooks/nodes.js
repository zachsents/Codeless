import { useMantineTheme } from "@mantine/core"
import { useNodeSuggestions } from "@minus/client-sdk"
import produce from "immer"
import _ from "lodash"
import { customAlphabet } from "nanoid"
import { alphanumeric } from "nanoid-dictionary"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { useReactFlow, useStore, useStoreApi } from "reactflow"
import { NodeDefinitions } from ".."


const generateId = customAlphabet(alphanumeric, 10)


const NodeContext = createContext()

export const NodeProvider = NodeContext.Provider

export function useNodeContext() {
    return useContext(NodeContext)
}

export function useNodeId() {
    return useNodeContext()?.id
}


function createNodeSelector(id, selector = x => x) {
    return s => selector(Object.fromEntries(s.nodeInternals)[id])
}


/**
 * Hook to select a node property from the store.
 *
 * @param {string} [id]
 * @param {Function | string | string[]} selector
 * @param {boolean} [returnSetter=false] If true, returns a setter function that can be used to update the node property.
 * The setter function takes two arguments: the value to set, and a boolean indicating whether to merge the value with the existing value.
 * Also, in order for the setter function to be returned, the selector must be a string or Array.
 */
export function useNodeProperty(id, selector, returnSetter = false) {
    id ??= useNodeId()
    const rf = useReactFlow()

    const usingLodash = typeof selector === "string" || Array.isArray(selector)

    const propertyValue = useStore(
        usingLodash ?
            createNodeSelector(id, node => _.get(node, selector)) :
            createNodeSelector(id, selector)
    )

    const setter = useCallback(
        returnSetter && usingLodash ?
            (value, merge = false) => {
                rf.setNodes(produce(draft => {
                    const node = draft.find(node => node.id == id)

                    if (merge) {
                        const original = _.get(node, selector)
                        // array case
                        if (Array.isArray(original))
                            return _.set(node, selector, [...original, ...value]), undefined
                        // object case
                        if (typeof original === "object")
                            return _.set(node, selector, { ...original, ...value }), undefined
                    }

                    // default case
                    _.set(node, selector, value)
                }))
            } :
            () => { }
        , [id, selector, rf])

    return returnSetter ? [propertyValue, setter] : propertyValue
}


/**
 * Hook to assign a node ID to a property in ReactFlow's store. 
 *
 * @export
 * @param {string} property
 */
export function useStoreProperty(property) {
    const storeApi = useStoreApi()
    const val = useStore(s => s[property])

    return [val, newVal => storeApi.setState({ [property]: newVal })]
}


/**
 * Hook to get the type definition of a node.
 *
 * @export
 * @param {string} [id]
 */
export function useTypeDefinition(id) {
    const typeDefId = useNodeProperty(id, "type")
    return NodeDefinitions[typeDefId]
}


/**
 * Hook to get colors for a node.
 *
 * @export
 * @param {string} [id]
 * @param {Array<number | "primary">} [shades=[]]
 * @return {string[]} 
 */
export function useColors(id, shades = []) {
    const theme = useMantineTheme()
    const typeDefinition = useTypeDefinition(id)

    return shades.map(shade => {
        if (typeof shade === "number")
            return theme.colors[typeDefinition.color][shade]

        if (shade === "primary")
            return theme.colors[typeDefinition.color][theme.primaryShade.light]
    })
}


/**
 * Hook to get the delete node function.
 *
 * @export
 * @param {string} [id]
 * @return {Function} 
 */
export function useDeleteNode(id) {
    id ??= useNodeId()
    const rf = useReactFlow()
    return useCallback(() => {
        rf.deleteElements({
            nodes: [rf.getNode(id)],
        })
    }, [rf, id])
}


/**
 * Hook to tell if a node is currently being connected.
 *
 * @export
 * @param {string} [id]
 * @return {boolean} 
 */
export function useIsNodeConnecting(id) {
    id ??= useNodeId()
    return useStore(s => s.connectionNodeId == id)
}


export function defaultObject() {
    const obj = {}
    Object.defineProperty(obj, Symbol.for("default"), {
        value: true,
        enumerable: false,
    })
    return obj
}


export function isDefaultObject(obj) {
    return obj[Symbol.for("default")] === true
}


/**
 * Hook to get and set the node's internal state.
 *
 * @export
 * @param {string} [id]
 * @return {[*, Function]}
 */
export function useInternalState(id) {
    const [state, setState] = useNodeProperty(id, "data.state", true)
    const typeDefinition = useTypeDefinition(id)

    // set default state
    useEffect(() => {
        if (state === undefined || isDefaultObject(state))
            setState(typeDefinition.defaultState ?? {})
    }, [])

    // return curried setter that merges
    return [state ?? {}, newState => setState(newState, true)]
}


export const HandleType = {
    Input: "target",
    Output: "source",
}

export const InputMode = {
    Handle: "handle",
    Config: "config",
}

export const ListMode = {
    Named: "named",
    Unnamed: "unnamed",
    None: false,
}


/**
 * Get the handle definition id from the handle id.
 * Example: "input.1" -> "input"
 *
 * @export
 * @param {string} handleId
 * @return {string} 
 */
export function getHandleDefinitionId(handleId) {
    return handleId.split(".")[0]
}


/**
 * Gets the handle definition given a node type definition ID and a handle definition ID.
 * If you only have the handle ID, make sure to use getHandleDefinitionId first.
 *
 * @export
 * @param {string} nodeTypeDefId
 * @param {string} handleDefId
 * @return {{ type: string, definition: Object } }} 
 */
export function getHandleDefinition(nodeTypeDefId, handleDefId) {
    const nodeTypeDef = NodeDefinitions[nodeTypeDefId]

    if (!nodeTypeDef)
        throw new Error(`Node type definition not found: ${nodeTypeDefId}`)

    const input = nodeTypeDef.inputs.find(input => input.id == handleDefId)
    if (input)
        return { type: HandleType.Input, definition: input }

    const output = nodeTypeDef.outputs.find(output => output.id == handleDefId)
    if (output)
        return { type: HandleType.Output, definition: output }

    return {}
}


/**
 * Hook to get the handle definition given a node ID and a handle ID.
 *
 * @export
 * @param {string} [nodeId]
 * @param {string} handleId
 * @return {{ type: string, definition: Object }}
 */
export function useHandleDefinition(nodeId, handleId) {
    const nodeTypeDefId = useNodeProperty(nodeId, "type")
    const handleDefId = getHandleDefinitionId(handleId)
    return getHandleDefinition(nodeTypeDefId, handleDefId)
}


/**
 * Hook to tell if a handle is connected or not.
 *
 * @export
 * @param {string} [nodeId]
 * @param {string} handleId
 * @return {boolean} 
 */
export function useHandleConnected(nodeId, handleId) {
    nodeId ??= useNodeId()

    return useStore(
        s => s.edges.some(edge =>
            (edge.target == nodeId && edge.targetHandle == handleId) ||
            (edge.source == nodeId && edge.sourceHandle == handleId)
        )
    )
}


/**
 * Hook to get and set the mode of an input.
 *
 * @export
 * @param {string} [nodeId]
 * @param {string} inputId
 * @return {["handle" | "config", Function]} 
 */
export function useInputMode(nodeId, inputId) {
    const [mode, setMode] = useNodeProperty(nodeId, ["data", `InputMode.${getHandleDefinitionId(inputId)}`], true)
    const { definition: inputDef } = useHandleDefinition(nodeId, inputId)

    // set default mode
    useEffect(() => {
        mode === undefined && setMode(inputDef.defaultMode)
    }, [])

    return [mode, setMode]
}


/**
 * Hook to get and set the value of an input.
 *
 * @export
 * @param {string} [nodeId]
 * @param {string} inputId
 * @param {*} defaultValue The default value for the input. If the input definition has a default value, that will be used instead.
 * @return {[*, Function]} 
 */
export function useInputValue(nodeId, inputId, defaultValue) {
    const [value, setValue] = useNodeProperty(nodeId, ["data", `InputValue.${inputId}`], true)
    const { definition: inputDef } = useHandleDefinition(nodeId, inputId)

    // set default value
    useEffect(() => {
        value === undefined && setValue(
            inputDef.defaultValue === undefined ? defaultValue : inputDef.defaultValue
        )
    }, [])

    return [value, setValue]
}


/**
 * Hook to get and set the list of a list input.
 *
 * @export
 * @param {string} [nodeId]
 * @param {string} handleId
 * @return {[Object[], Function]} 
 */
export function useListHandle(nodeId, handleId) {
    const [list, setList] = useNodeProperty(nodeId, ["data", `List.${getHandleDefinitionId(handleId)}`], true)
    const { definition: handleDef } = useHandleDefinition(nodeId, handleId)

    const createEmptyListItem = useCreateEmptyListItem(nodeId, handleId)

    if (!handleDef.listMode)
        return []

    // set empty list as default
    useEffect(() => {
        if (list === undefined) {
            if (handleDef.defaultList != null) {
                const defaultList = typeof handleDef.defaultList === "number" ?
                    Array(handleDef.defaultList).fill().map(createEmptyListItem) :
                    handleDef.defaultList.map(item => ({ id: generateId(), ...item }))

                setList(defaultList)
            }
            else setList([])
        }
    }, [])

    return [list, setList]
}


/**
 * Hook to get and set whether an output is showing.
 *
 * @export
 * @param {string} [nodeId]
 * @param {string} outputId
 * @return {[boolean, Function]} 
 */
export function useOutputShowing(nodeId, outputId) {
    const [showing, setShowing] = useNodeProperty(nodeId, ["data", `OutputShowing.${getHandleDefinitionId(outputId)}`], true)
    const { definition: handleDef } = useHandleDefinition(nodeId, outputId)

    // set default value
    useEffect(() => {
        showing === undefined && setShowing(handleDef.defaultShowing)
    }, [])

    return [showing, setShowing]
}


/**
 * Hook to get suggestions for a handle.
 *
 * @export
 * @param {string} [nodeTypeDefId]
 * @param {string} handleId
 */
export function useHandleSuggestions(nodeTypeDefId, handleId) {
    nodeTypeDefId ??= useNodeProperty(null, "type")
    const { data: suggestions } = useNodeSuggestions(nodeTypeDefId)
    return suggestions?.[getHandleDefinitionId(handleId)] ?? []
}


/**
 * Hook that returns a function to create an empty list item. Nice
 * to have because named lists should have a name property.
 *
 * @export
 * @param {string} [nodeId]
 * @param {string} handleId
 * @return {() => { id: string, name?: string }}
 */
export function useCreateEmptyListItem(nodeId, handleId) {
    const { definition } = useHandleDefinition(nodeId, handleId)
    const isNamed = definition.listMode === ListMode.Named

    return useCallback(() => {
        return isNamed ?
            { id: generateId(), name: "" } :
            { id: generateId() }
    }, [isNamed])
}


export function useDeselectAfter(nodeId) {
    const [selected, setSelected] = useNodeProperty(nodeId, "selected", true)
    const [shouldDeselect, setShouldDeselect] = useState(false)

    useEffect(() => {
        if (shouldDeselect && selected) {
            setSelected(false)
            setShouldDeselect(false)
        }
    }, [selected, shouldDeselect])

    return () => setShouldDeselect(true)
}


export function useIntegrationAccounts(nodeId, app) {

    const typeDef = useTypeDefinition(nodeId)

    const [selectedAccounts, setSelectedAccounts] = useNodeProperty(nodeId, ["data", "selectedAccounts"], true)

    return {
        needsAccounts: typeDef.requiredIntegrations?.length > 0,
        selectedAccounts: selectedAccounts ?? {},
        selectAccount: (integrationId, accountId) => setSelectedAccounts({
            ...selectedAccounts,
            [integrationId]: accountId
        }),
        availableAccounts: Object.fromEntries(
            typeDef.requiredIntegrations?.map(integrationId => [
                integrationId,
                app?.integrations[integrationId]?.map(accountId => ({
                    id: accountId,
                    nickname: app?.accountNicknames?.[accountId] || accountId.split(":")[1],
                })) ?? []
            ]) ?? []
        ),
        missingSelections: !typeDef.requiredIntegrations?.every(integrationId => selectedAccounts?.[integrationId] != null),
        requiredIntegrations: typeDef.requiredIntegrations ?? [],
    }
}