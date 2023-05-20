import { ActionIcon, Kbd, TextInput } from "@mantine/core"
import { useFocusWithin, useHotkeys, useHover } from "@mantine/hooks"
import { forwardRef, useImperativeHandle, useRef } from "react"
import { TbSearch, TbX } from "react-icons/tb"


const SearchInput = forwardRef(({
    noun, quantity,
    hotkeys = ["mod+k", "/"],
    onClear,
    ...props
}, ref) => {

    const searchRef = useRef()

    // focusing & hovering states
    const { focused, ref: focusRef } = useFocusWithin()
    const { hovered, ref: hoverRef } = useHover()

    // fix refs
    // source: https://stackoverflow.com/questions/68162617/whats-the-correct-way-to-use-useref-and-forwardref-together
    useImperativeHandle(ref, () => searchRef.current)
    useImperativeHandle(focusRef, () => searchRef.current)

    // hotkey for search
    useHotkeys(hotkeys.map(hk => [hk, () => {
        searchRef.current?.focus()
        searchRef.current?.select()
    }]))

    // clearing text input
    const handleClear = () => {
        searchRef.current?.focus()
        onClear?.()
    }

    return (
        // hover ref goes on wrapper so right section doesn't interfere with hover detection
        <div ref={hoverRef}>
            <TextInput
                size="xs" icon={<TbSearch />}
                placeholder={(noun != null & quantity != null) ?
                    `Search ${quantity ?? ""} ${noun}${quantity == 1 ? "" : "s"}` :
                    undefined}
                rightSection={
                    hovered ?
                        <ActionIcon size="sm" radius="sm" onClick={handleClear}>
                            <TbX size="0.9em" />
                        </ActionIcon> :
                        focused ?
                            // need this empty div to prevent the input from shrinking
                            <div></div> :
                            <Kbd size="xs">/</Kbd>
                }
                {...props}
                ref={searchRef}
            />
        </div>
    )
})

SearchInput.displayName = "SearchInput"

export default SearchInput