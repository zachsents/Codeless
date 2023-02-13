import { ActionIcon, SimpleGrid, Skeleton, Text, TextInput } from '@mantine/core'
import { useEffect } from 'react'
import { TbSearch, TbX } from 'react-icons/tb'
import { useSearch } from '../modules/hooks'
import { objectOrFunction } from "../modules/util"


export default function Search({ list, selector, noun,
    component: Component,
    componentItemProp = "item",
    componentProps = {},
    gridProps = {},
    gridRef,
    inputProps = {},
    inputRef,
    skeletonHeight = 80,

    onChange,
}) {

    const [filtered, query, setQuery] = useSearch(list, selector)

    const callbackOptions = { query }

    useEffect(() => {
        onChange?.(filtered, callbackOptions)
    }, [filtered])

    return (
        <>
            <TextInput
                value={query}
                onChange={event => setQuery(event.currentTarget.value)}
                radius="lg"
                size="lg"
                placeholder={`Search ${list?.length ?? ""} ${noun}${list?.length == 1 ? "" : "s"}...`}
                icon={<TbSearch />}
                rightSection={query &&
                    <ActionIcon radius="md" mr="xl" onClick={() => setQuery("")}>
                        <TbX />
                    </ActionIcon>
                }
                {...objectOrFunction(inputProps, callbackOptions)}
                ref={inputRef}
            />
            {filtered?.length == 0 &&
                <Text align="center" size="lg" color="dimmed">No {noun}s found.</Text>}

            <SimpleGrid 
            cols={2} 
            spacing="xl" 
            {...objectOrFunction(gridProps, callbackOptions)}
            ref={gridRef}
            >
                {list ?
                    filtered?.map((item, i) =>
                        <Component
                            {...{ [componentItemProp]: item }}
                            {...objectOrFunction(componentProps, item, i, callbackOptions)}
                            key={`${noun}-${i}`}
                        />
                    )
                    :
                    <>
                        <Skeleton height={skeletonHeight} />
                        <Skeleton height={skeletonHeight} />
                        <Skeleton height={skeletonHeight} />
                    </>
                }
            </SimpleGrid>
        </>
    )
}