import { Stack } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useEffect } from 'react'
import { useEdges, useNodes } from 'react-flow-renderer'

export default function Execution() {

    // listen to changes on nodes and edges
    const nodes = useNodes()
    const edges = useEdges()

    // memoize the info we need and package it up for the worker
    const workerMessage = {
        nodes: nodes.map(node => ({
            id: node.id,
            type: node.type,
            state: node.data?.state
        })),
        edges: edges.map(edge => ({
            source: edge.source,
            sourceHandle: edge.sourceHandle,
            target: edge.target,
            targetHandle: edge.targetHandle
        }))
    }

    // debounce worker message to use as dep for effect
    const [debouncedWorkerMessage] = useDebouncedValue(JSON.stringify(workerMessage), 300)

    // start a worker when changes to the graph are made
    useEffect(() => {
        if (nodes.length > 0) {

            // start worker
            const worker = new Worker(new URL('../../modules/execution.js', import.meta.url), {
                type: "module"
            })

            // send necessary info from nodes and edges
            worker.postMessage(workerMessage)

            return () => worker.terminate()
        }
    }, [debouncedWorkerMessage])


    return (
        <>
            <Stack sx={containerStyle}>
                {/* <Console logs={logs || []} /> */}
            </Stack>
        </>
    )
}

const containerStyle = theme => ({
    position: "absolute",
    top: 10,
    right: 10,
    width: 300,
    pointerEvents: "none",
    zIndex: 100,
})
