import { Badge, Button, Group, Overlay, Popover, ScrollArea, Stack, TextInput } from '@mantine/core'
import { CgSearch } from "react-icons/cg"
import SearchItem from './SearchItem'
import { useDisclosure } from '@mantine/hooks'
import searchIndex from '../../modules/search'
import { useMemo, useRef, useState } from 'react'


export default function Search() {

    const [searchQuery, setSearchQuery] = useState("")
    const [popoverOpened, popoverHandlers] = useDisclosure(false)
    const searchBoxRef = useRef()
    const itemsRef = useRef([])

    // memoized search results
    const items = useMemo(
        () => searchIndex.search(searchQuery).map(result => result.doc),
        [searchQuery]
    )

    // open popover and select search query on focus
    const handleFocus = () => {
        popoverHandlers.open()
        searchBoxRef.current.select()
    }

    // treat pressing 'Enter' as a click on the first item
    const enterHandler = event => {
        if (event.key == "Enter" && !!searchQuery) {
            itemsRef.current[0].click()
            document.activeElement.blur()
        }
    }

    // refine search with filter buttons
    const refineSearch = filter => {
        setSearchQuery(`${filter} `)
        searchBoxRef.current.focus()
    }

    // const ref = useClickOutside(() => setOpened(false));

    return (
        <>
            <Group sx={containerStyle} position="center">
                <Stack align="center" spacing="xs">
                    <Popover
                        opened={popoverOpened}
                        onChange={change => !change && popoverHandlers.close()}
                        styles={popoverStyles}
                        transition="scale-y"
                        transitionDuration={100}
                    >
                        <Popover.Target>
                            <TextInput
                                icon={<CgSearch />}
                                placeholder="Search nodes..."
                                size="lg"
                                radius="xl"
                                styles={searchBarStyles}
                                ref={searchBoxRef}
                                onFocus={handleFocus}
                                value={searchQuery}
                                onChange={event => setSearchQuery(event.currentTarget.value)}
                                onKeyDownCapture={enterHandler}
                            />
                        </Popover.Target>
                        <Popover.Dropdown>
                            <>

                                <ScrollArea styles={scrollAreaStyles} onClick={popoverHandlers.close}>
                                    {items.map((item, i) =>
                                        <SearchItem
                                            name={item.name}
                                            badges={<>
                                                {item.categories?.map(cat =>
                                                    <Badge key={cat}>{cat}</Badge>
                                                )}
                                            </>}
                                            createNode={() => item._create(item, [0, 0])}
                                            ref={el => itemsRef.current[i] = el}
                                            key={item.id}
                                        >
                                            {item.description}
                                        </SearchItem>
                                    )}
                                </ScrollArea>
                            </>
                        </Popover.Dropdown>
                    </Popover>
                    <Group>
                        <Button
                            color="red" radius="xl" size="xs" variant="light"
                            onClick={() => refineSearch("action")}
                        >
                            Actions</Button>
                        <Button
                            color="grape" radius="xl" size="xs" variant="light"
                            onClick={() => refineSearch("event")}
                        >
                            Events</Button>
                        <Button
                            color="gray" radius="xl" size="xs" variant="light"
                            onClick={() => refineSearch("primitive")}
                        >
                            Primitives</Button>
                        {/* <Button color="green" radius="xl" size="xs" variant="light">States</Button> */}
                        <Button
                            color="yellow" radius="xl" size="xs" variant="light"
                            onClick={() => refineSearch("transform")}
                        >
                            Transforms</Button>
                    </Group>
                </Stack>
            </Group>
            {popoverOpened && <Overlay opacity={0} zIndex={99} />}
        </>
    )
}

const badgeColorMap = {
    action: "red",
    event: "grape",
    primitive: "gray",
    state: "green",
    transform: "yellow"
}

const searchBarStyles = theme => ({
    root: {
        width: 500,
    }
})

const scrollAreaStyles = theme => ({
    root: {
        height: 300,
    },
    viewport: {
        padding: "0px 20px 20px 10px"
    }
})

const popoverStyles = theme => ({
    dropdown: {
        width: 700,
        background: "transparent",
        border: "none",
        marginLeft: -10,
    }
})

const containerStyle = theme => ({
    position: "absolute",
    top: 10,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 100,
    width: "100%",
})
