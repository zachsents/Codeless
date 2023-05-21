import { ArrowBigRightLine, Code, CodeDots } from "tabler-icons-react"
import CodeControl from "../components/CodeControl"


/** 
 * @type {import("../DefaultTemplate.jsx").NodeTypeDefinition} 
 */
export default {
    id: "basic:CustomCode",
    name: "Custom Code",
    description: "Allows you to write a custom JavaScript function.",
    icon: CodeDots,

    tags: ["Advanced"],

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
            defaultValue: `/*
 * Inputs are available under the "inputs" global variable.
 * e.g. inputs.a, inputs.name, etc.
 * 
 * Outputs are set by setting a property on the "outputs" global variable.
 * e.g. outputs.result = "some value";
 * 
 */

`,
            renderConfiguration: props => <CodeControl {...props} language="javascript" />,
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
