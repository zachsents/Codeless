import { ActionIcon, Kbd, TextInput } from "@mantine/core"
import { useFocusWithin, useHotkeys, useHover, useMergedRef } from "@mantine/hooks"
import { forwardRef } from "react"
import { TbSearch, TbX } from "react-icons/tb"


const SearchInput = forwardRef(({
    noun, quantity,
    hotkeys = ["mod+k", "/"],
    onClear,
    ...props
}, ref) => {

    // focusing & hovering states
    const { focused, ref: focusRef } = useFocusWithin()
    const { hovered, ref: hoverRef } = useHover()
    const hoverAndFocusRef = useMergedRef(focusRef, hoverRef)

    // hotkey for search
    useHotkeys(hotkeys.map(hk => [hk, () => {
        ref.current?.focus()
        ref.current?.select()
    }]))

    // clearing text input
    const handleClear = () => {
        ref.current?.focus()
        onClear?.()
    }

    return (
        // hover ref goes on wrapper so right section doesn't interfere with hover detection
        <div ref={hoverAndFocusRef}>
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
                ref={ref}

                // blur when escape is pressed
                onKeyDown={event => event.key === "Escape" && ref.current?.blur()}
            />
        </div>
    )
})

SearchInput.displayName = "SearchInput"

export default SearchInput