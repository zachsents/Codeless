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

    const handleElements = handles?.map(handle => {

        // handle can either be just a name or an object
        const { name, label, list, suggested } = typeof handle === "string" ? {
            name: handle,
            label: null,
            list: false,
            suggested: null,
        } : handle

        // if it's a list handle, get current number of handles
        const numberOfHandles = list ? queryListHandle(name) : 1

        // map out to elements
        return Array(numberOfHandles).fill(0).map((_, i) => {
            // include index in handle ID for list handles
            const handleId = list ? `${name}.${i}` : name

            return <Handle
                id={handleId}
                name={name}
                label={label}
                position={position ?? inferredPosition}
                direction={direction}
                suggested={suggested}
                // spread additional props to handle -- can be object or function
                {...(typeof handleProps == "function" ? handleProps(handleId) : handleProps)}
                key={handleId}
            />
        })
    }).flat() ?? <></>

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