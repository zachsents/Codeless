import { Button, Center, Container, Group, Overlay, Portal, Stack } from "@mantine/core"
import { useClickOutside, useDisclosure } from "@mantine/hooks"
import Editor from "@monaco-editor/react"
import { useEffect, useState } from "react"
import { useInputValue } from "../hooks/nodes"


export default function CodeControl({ inputId, inputProps = {}, language }) {

    // input value state
    const [value, setValue] = useInputValue(null, inputId)

    // modal state
    const [modalOpened, modalHandlers] = useDisclosure()

    // value for editor content
    const [workingValue, setWorkingValue] = useState(value || "")

    // sync input value with working value
    useEffect(() => {
        setWorkingValue(value || "")
    }, [value])

    // handle cancel by resetting working value
    const handleCancel = () => {
        setWorkingValue(value || "")
        modalHandlers.close()
    }

    // handle save by setting value
    const handleSave = () => {
        setValue(workingValue)
        modalHandlers.close()
    }

    // handle click outside
    const clickOutsideRef = useClickOutside(handleCancel)

    return (
        <>
            <Center>
                <Button size="xs" onClick={modalHandlers.open}>
                    Open Code Editor
                </Button>
            </Center>

            {modalOpened &&
                <Portal>
                    <div className="absolute top-0 left-0 w-screen h-screen z-[1000]">
                        <Container size="md" className="relative z-10 h-full">
                            <Center h="100%">
                                <Stack w="100%" h="75vh" ref={clickOutsideRef}>
                                    <div className="flex-1 rounded-md bg-white py-xs">
                                        <Editor
                                            height="100%"
                                            defaultLanguage={language}
                                            options={{
                                                fontFamily: "JetBrains Mono",
                                            }}
                                            value={workingValue}
                                            onChange={setWorkingValue}
                                            onMount={editor => {
                                                editor.setPosition({
                                                    lineNumber: editor.getModel().getLineCount(),
                                                    column: editor.getModel().getLineMaxColumn(editor.getModel().getLineCount()),
                                                })
                                                editor.focus()
                                            }}
                                            {...inputProps}
                                        />
                                    </div>

                                    <Group position="right">
                                        <Button radius="xl" variant="outline" color="red" onClick={handleCancel}>Cancel</Button>
                                        <Button radius="xl" onClick={handleSave}>Save</Button>
                                    </Group>
                                </Stack>
                            </Center>
                        </Container>
                        <Overlay zIndex={5} />
                    </div>
                </Portal>}
        </>
    )
}

const editorStyle = {
    fontFamily: '"Fira code", "Fira Mono", monospace',
    fontSize: 12,
    wordBreak: "break-word",
    height: "100%",
}

const wrapperStyle = theme => ({
    border: "1px solid " + theme.colors.gray[2],
    borderRadius: theme.radius.md,
})