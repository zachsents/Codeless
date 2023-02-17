import { CodeDots } from "tabler-icons-react"
import CodeEditor from "react-simple-code-editor"
import { Control, ControlLabel, ControlStack, ListHandlesControl, ListHandlesNodeContent } from "../components"
import { Box, Divider, Group, SimpleGrid } from "@mantine/core"

import hljs from "highlight.js/lib/common"
import "highlight.js/styles/github.css"


export default {
    id: "basic:CustomCode",
    name: "Custom Code",
    description: "Allows you to write a custom JavaScript function.",
    icon: CodeDots,

    inputs: [
        {
            name: "input",
            list: true,
        }
    ],
    outputs: [
        {
            name: "output",
            list: true,
        }
    ],

    defaultState: {
        code: "",
        inputLabels: [],
        outputLabels: [],
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