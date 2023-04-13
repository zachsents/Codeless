import { Box } from "@mantine/core"
import CodeEditor from "react-simple-code-editor"
import { CodeDots } from "tabler-icons-react"

import hljs from "highlight.js/lib/common"
import "highlight.js/styles/github.css"
import { ArrowBigRightLine, Code } from "tabler-icons-react"
import { useInputValue } from "../hooks/nodes"


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
            name: "Input",
            description: "The inputs to the code.",
            tooltip: "The inputs to the code. They are available under the \"inputs\" global variable.",
            icon: ArrowBigRightLine,
            listMode: "named",
            defaultList: 1,
        },
        {
            id: "code",
            description: "The JavaScript code that will be executed. Inputs are available under the \"inputs\" global variable. Outputs are set by setting a property on the \"outputs\" global variable.",
            tooltip: "The JavaScript code that will be executed. Inputs are available under the \"inputs\" global variable. Outputs are set by setting a property on the \"outputs\" global variable.",
            icon: Code,
            allowedModes: ["config", "handle"],
            defaultMode: "config",
            renderConfiguration: ({ inputId }) => {

                const [value, setValue] = useInputValue(null, inputId)

                return (
                    <Box sx={codeEditorStyle}>
                        <CodeEditor
                            placeholder="outputs.sum = inputs.a + inputs.b"
                            value={value ?? ""}
                            onValueChange={setValue}
                            highlight={code => hljs.highlight(code, { language: "js" }).value}
                            padding={10}
                            style={{
                                fontFamily: '"Fira code", "Fira Mono", monospace',
                                fontSize: 12,
                            }}
                        />
                    </Box>
                )
            },
        }
    ],
    outputs: [
        {
            id: "output",
            name: "Output",
            description: "The outputs to the code.",
            tooltip: "The outputs to the code. They are set by setting a property on the \"outputs\" global variable.",
            icon: ArrowBigRightLine,
            listMode: "named",
            defaultList: 1,
        },
    ],
}


const codeEditorStyle = theme => ({
    border: "1px solid " + theme.colors.gray[2],
    borderRadius: theme.radius.md,
})