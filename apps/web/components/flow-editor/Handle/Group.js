import { forwardRef, memo } from "react"
import { Position } from "reactflow"

import { longhandHandle, useListHandle } from "@minus/graph-util"
import { HandleDirection } from "."
import Handle from "./Handle"
import VerticalContainer from "./VerticalContainer"


const Group = memo(forwardRef(({
    handles,
    direction,
    position,
    includeContainer = false,
    handleProps = {},
}, ref) => {

    const inferredPosition = direction == HandleDirection.Input ? Position.Left : Position.Right

    const handleElements = handles?.flatMap(handle => {

        // handle can either be just a name or an object
        const { name, list, ...handleInfo } = longhandHandle(handle)

        // if it's a list handle, get current number of handles
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [listLabels] = (list && useListHandle(null, name)) || [[null]]

        // map out to elements
        return listLabels?.map(listLabel => {
            // include index in handle ID for list handles
            const handleId = list ? `${name}.${listLabel.id}` : name

            return <Handle
                id={handleId}
                name={name}
                list={list}
                {...handleInfo} // includes label
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