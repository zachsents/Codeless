import { Box, Divider, Group, SimpleGrid } from "@mantine/core"
import CodeEditor from "react-simple-code-editor"
import { CodeDots } from "tabler-icons-react"
import { Control, ControlLabel, ControlStack, ListHandlesControl, ListHandlesNodeContent } from "../components/index"

import hljs from "highlight.js/lib/common"
import "highlight.js/styles/github.css"
import { ArrowBigRightLine } from "tabler-icons-react"


/** 
 * @type {import("../DefaultTemplate.jsx").NodeTypeDefinition} 
 */
export default {
    id: "basic:CustomCode",
    name: "Custom Code",
    description: "Allows you to write a custom JavaScript function.",
    icon: CodeDots,

    inputs: [
        {
            id: "input",
            name: "Inputs",
            description: "The inputs to the code.",
            tooltip: "The inputs to the code. They are available under the \"inputs\" global variable.",
            icon: ArrowBigRightLine,
            listMode: "named",
        }
    ],
    outputs: [
        {
            id: "output",
            description: "The outputs to the code.",
            tooltip: "The outputs to the code. They are set by setting a property on the \"outputs\" global variable.",
            icon: ArrowBigRightLine,
            listMode: "named",
        }
    ],

    defaultState: {
        code: "",
    },

    renderNode: ({ state, listHandles, alignHandles }) => {
        return (
            <Group noWrap position="apart">
                <ListHandlesNodeContent
                    handleName="input"
                    listHandles={listHandles}
                    alignHandles={alignHandles}
                    state={state}
                    arrowSide="in"
                    emptyMessage="No inputs"
                    stateKey="inputLabels"
                />
                <Divider orientation="vertical" />
                <ListHandlesNodeContent
                    handleName="output"
                    listHandles={listHandles}
                    alignHandles={alignHandles}
                    state={state}
                    arrowSide="out"
                    emptyMessage="No outputs"
                    stateKey="outputLabels"
                />
            </Group>
        )
    },

    configuration: ({ state, setState, listHandles, maximized }) => {

        return (
            <ControlStack>
                <SimpleGrid cols={maximized ? 2 : 1} spacing="lg">
                    <ListHandlesControl
                        handleName="input"
                        listHandles={listHandles}
                        state={state}
                        setState={setState}
                        controlTitle="Inputs"
                        controlInfo="The inputs to the code."
                        addLabel="Add Input"
                        inputPlaceholder="Input Name"
                        stateKey="inputLabels"
                    />
                    <ListHandlesControl
                        handleName="output"
                        listHandles={listHandles}
                        state={state}
                        setState={setState}
                        controlTitle="Outputs"
                        controlInfo="The outputs to the code."
                        addLabel="Add Output"
                        inputPlaceholder="Output Name"
                        stateKey="outputLabels"
                    />
                </SimpleGrid>

                <Control>
                    <ControlLabel info="The code that will be executed.">
                        Code
                    </ControlLabel>
                    <Box sx={codeEditorStyle}>
                        <CodeEditor
                            placeholder="const firstInput = inputs[0];"
                            value={state.code}
                            onValueChange={code => setState({ code })}
                            highlight={code => hljs.highlight(code, { language: "js" }).value}
                            padding={10}
                            style={{
                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                fontSize: 12,
                            }}
                        />
                    </Box>
                </Control>
            </ControlStack>
        )
    },

}


const codeEditorStyle = theme => ({
    border: "1px solid " + theme.colors.gray[2],
    borderRadius: theme.radius.md,
})