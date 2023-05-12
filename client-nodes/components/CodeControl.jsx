import { useInputValue } from "../hooks/nodes"
import { Box } from "@mantine/core"
import CodeEditor from "react-simple-code-editor"
import hljs from "highlight.js/lib/common"
import "highlight.js/styles/github.css"


export default function CodeControl({ inputId, inputProps = {}, language }) {

    const [value, setValue] = useInputValue(null, inputId)

    return (
        <Box sx={wrapperStyle}>
            <CodeEditor
                value={value ?? ""}
                onValueChange={setValue}
                highlight={language ?
                    code => hljs.highlight(code, { language }).value :
                    code => code}
                padding={10}
                style={editorStyle}
                {...inputProps}
            />
        </Box>
    )
}

const editorStyle = {
    fontFamily: '"Fira code", "Fira Mono", monospace',
    fontSize: 12,
}

const wrapperStyle = theme => ({
    border: "1px solid " + theme.colors.gray[2],
    borderRadius: theme.radius.md,
})