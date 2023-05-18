import { ActionIcon, TextInput } from "@mantine/core"
import { useHotkeys } from "@mantine/hooks"
import { forwardRef, useImperativeHandle, useRef } from "react"
import { TbSearch, TbX } from "react-icons/tb"


const SearchInput = forwardRef(({ noun, quantity, onClear, ...props }, ref) => {

    const searchRef = useRef()

    // fix refs
    // source: https://stackoverflow.com/questions/68162617/whats-the-correct-way-to-use-useref-and-forwardref-together
    useImperativeHandle(ref, () => searchRef.current)

    // hotkey for search
    useHotkeys([
        ["mod+k", () => searchRef.current?.focus()],
        ["/", () => searchRef.current?.focus()],
    ])

    // clearing text input
    const handleClear = () => {
        searchRef.current?.focus()
        onClear?.()
    }

    return (
        <TextInput
            size="xs" icon={<TbSearch />}
            placeholder={`Search ${quantity ?? ""} ${noun}${quantity == 1 ? "" : "s"}`}
            rightSection={
                <ActionIcon size="sm" radius="sm" onClick={handleClear} className="opacity-0 clearButton">
                    <TbX size="0.9em" />
                </ActionIcon>
            }
            styles={{
                root: {
                    "&:hover .clearButton": { opacity: 1 }
                },
            }}
            {...props}
            ref={searchRef}
        />
    )
})

SearchInput.displayName = "SearchInput"

export default SearchInput