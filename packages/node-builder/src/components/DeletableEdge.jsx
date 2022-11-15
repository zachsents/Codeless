import { Center, CloseButton } from '@mantine/core'
import { getBezierPath, useReactFlow } from 'reactflow'
import { removeEdge } from '../util'

const foreignObjectSize = 34

const onEdgeClick = (evt, id) => {
    evt.stopPropagation()
}

export default function DeletableEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data
}) {
    const edgePath = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    })
    // const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    //     sourceX,
    //     sourceY,
    //     targetX,
    //     targetY,
    // })    
    const [edgeCenterX, edgeCenterY] = [0, 0]

    const reactFlow = useReactFlow()

    return (
        <>
            <path
                id={id}
                style={style}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
            />
            <foreignObject
                width={foreignObjectSize}
                height={foreignObjectSize}
                x={edgeCenterX - foreignObjectSize / 2}
                y={edgeCenterY - foreignObjectSize / 2}
                className="edgebutton-foreignobject"
                requiredExtensions="http://www.w3.org/1999/xhtml"
            >
                <Center sx={buttonWrapperStyle}>
                    <CloseButton
                        variant="filled"
                        color="red"
                        size="sm"
                        sx={buttonStyle}
                        onClick={() => removeEdge(id, reactFlow)}
                    />
                </Center>
            </foreignObject>
        </>
    )
}

const buttonStyle = theme => ({
    transform: "scale(0)",
    transition: "all 0.1s",
    color: theme.colors.red[7]
})

const buttonWrapperStyle = theme => ({
    width: "100%",
    height: "100%",
    "&:hover button": {
        transform: "scale(1.4)",
        color: "white"
    }
})
