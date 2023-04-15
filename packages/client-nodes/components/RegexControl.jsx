import { Box, Button, Group, Menu, Text, ThemeIcon, Tooltip } from "@mantine/core"
import hljs from "highlight.js/lib/common"
import "highlight.js/styles/github.css"
import { TbCheck, TbInfoCircle } from "react-icons/tb"
import CodeEditor from "react-simple-code-editor"
import { useInputValue } from "../hooks/nodes"
import styles from "./RegexControl.module.css"
import RegexHighlighter from "./regex-highlighter"
import "./regex-highlighter.css"


hljs.registerLanguage("regex", RegexHighlighter)


const DEFAULT_FLAGS = {
    g: false,
    i: false,
    m: false,
    s: false,
    u: false,
    y: false,
    d: false,
}


export default function RegexControl({ inputId, inputProps = {} }) {

    const [value, setValue] = useInputValue(null, inputId, {
        source: "",
        flags: DEFAULT_FLAGS,
    })

    const setSource = source => {
        setValue({
            source: source.replaceAll("\n", ""),
        }, true)
    }

    const textProps = {
        size: inputProps.size ?? "sm",
        color: "dimmed",
    }

    return <Group spacing="xs">
        <Text {...textProps}>/</Text>
        <Box className={styles.editor}>
            <CodeEditor
                placeholder=""
                value={value?.source ?? ""}
                onValueChange={setSource}
                highlight={code => hljs.highlight(code, { language: "regex" }).value}
                padding={5}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 16,
                    maxWidth: 220,
                }}
            />
        </Box>
        <Text {...textProps}>/</Text>
        <Menu closeOnItemClick={false} shadow="sm">
            <Menu.Target>
                <Tooltip label="Change Flags">
                    <Button color="gray" variant="light" size={inputProps.size} compact>
                        {Object.keys(value?.flags ?? {}).filter((flag) => value?.flags?.[flag]).join("") ||
                            "No Flags"}
                    </Button>
                </Tooltip>
            </Menu.Target>
            <Menu.Dropdown maw={400}>
                <Menu.Label>Flags</Menu.Label>
                <FlagControl flag="g" name="[g]lobal" description="Performs a global match, finding all matches rather than just the first" inputId={inputId} />
                <FlagControl flag="i" name="[i]gnore case" description="Makes the whole expression case-insensitive" inputId={inputId} />
                <FlagControl flag="m" name="[m]ultiline" description="Changes the meaning of ^ and $ so they match at the beginning and end, respectively, of any line" inputId={inputId} />
                <FlagControl flag="s" name="[s]ingle line" description="Changes the meaning of the dot (.) so it matches every character (instead of every character except \n)" inputId={inputId} />
                <FlagControl flag="u" name="[u]nicode" description="Makes \w, \W, \b, \B, \d, \D, \s and \S dependent on the Unicode character properties database" inputId={inputId} />
                <FlagControl flag="y" name="stick[y]" description="Matches only from the index indicated by the lastIndex property of this regular expression in the target string" inputId={inputId} />
            </Menu.Dropdown>
        </Menu>
    </Group>
}


function FlagControl({ flag, name, description, inputId }) {
    const [value, setValue] = useInputValue(null, inputId)

    const toggleFlag = () => {
        setValue({
            flags: {
                ...(value?.flags ?? DEFAULT_FLAGS),
                [flag]: !value?.flags?.[flag],
            }
        }, true)
    }

    return <Menu.Item
        onClick={toggleFlag}
    >
        <Group position="apart">
            <Group>
                {value?.flags?.[flag] ?
                    <ThemeIcon size="sm" radius="xl">
                        <TbCheck />
                    </ThemeIcon> :
                    <ThemeIcon size="sm" radius="xl" variant="outline"></ThemeIcon>}
                <Text>{name}</Text>
            </Group>
            <Tooltip label={description} w={300} multiline>
                <Text color="dimmed"><TbInfoCircle /></Text>
            </Tooltip>
        </Group>
    </Menu.Item>
}