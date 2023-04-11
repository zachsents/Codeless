import { forwardRef, memo } from "react"
import { Position } from "reactflow"

import { HandleDirection } from "."
import Handle from "./Handle"
import VerticalContainer from "./VerticalContainer"


const Group = memo(forwardRef(({
    handles,
    direction,
    position,
    includeContainer = false,
    queryListHandle = () => 1,
    handleProps = {},
}, ref) => {

    const inferredPosition = direction == HandleDirection.Input ? Position.Left : Position.Right

    const handleElements = handles?.flatMap(handle => {

        // if it's a list handle, get current number of handles
        const numberOfHandles = handle.listMode ? queryListHandle(handle.id) : 1

        // map out to elements
        return Array(numberOfHandles).fill(0).map((_, i) => {
            // include index in handle ID for list handles
            const handleId = handle.listMode ? `${handle.id}.${i}` : handle.id

            return <Handle
                id={handleId}
                label={handle.name}
                handleDef={handle}
                position={position ?? inferredPosition}
                direction={direction}
                // spread additional props to handle -- can be object or function
                {...(typeof handleProps == "function" ? handleProps(handleId) : handleProps)}
                key={handleId}
            />
        })
    }) ?? <></>

    return includeContainer ?
        <VerticalContainer position={position ?? inferredPosition} ref={ref}>
            {handleElements}
        </VerticalContainer>
        :
        handleElements
}
))

Group.displayName = "Handle.Group"

export default Group