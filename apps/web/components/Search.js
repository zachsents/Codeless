import { ActionIcon, SimpleGrid, Skeleton, Text, TextInput } from '@mantine/core'
import { Fragment, useEffect, useState } from 'react'
import { TbSearch, TbX } from 'react-icons/tb'
import { useSearch } from '../modules/hooks'
import { objectOrFunction } from "../modules/util"


export default function Search({ list: listArg, selector, noun,
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

    const [query, setQuery] = useState("")

    // list prop can be single list or list of lists
    const singleList = isSingleList(listArg)
    const lists = singleList ? [{ name: null, list: listArg }] : listArg

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const filteredLists = lists.map(({ list }) => useSearch(list, selector, query)[0])

    // calculate total items
    const totalItems = lists.reduce((sum, cur) => sum + (cur.list?.length ?? 0), 0)

    const callbackOptions = { query }

    useEffect(() => {
        onChange?.(singleList ? filteredLists[0] : filteredLists, callbackOptions)
    }, [...filteredLists])

    return (
        <>
            <TextInput
                value={query}
                onChange={event => setQuery(event.currentTarget.value)}
                radius="lg"
                size="lg"
                placeholder={`Search ${totalItems || ""} ${noun}${totalItems == 1 ? "" : "s"}...`}
                icon={<TbSearch />}
                rightSection={query &&
                    <ActionIcon radius="md" mr="xl" onClick={() => setQuery("")}>
                        <TbX />
                    </ActionIcon>
                }
                {...objectOrFunction(inputProps, callbackOptions)}
                ref={inputRef}
            />

            {lists.map(({ name, list }, i) =>
                <Fragment key={i}>
                    {name && <Text>{name}</Text>}

                    {filteredLists[i]?.length == 0 &&
                        <Text align="center" size="lg" color="dimmed">No {noun}s found.</Text>}

                    <SimpleGrid
                        cols={2}
                        spacing="xl"
                        {...objectOrFunction(gridProps, callbackOptions)}
                        ref={gridRef}
                    >
                        {list ?
                            filteredLists[i]?.map((item, i) =>
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
                </Fragment>
            )}
        </>
    )
}


function isSingleList(arg) {

    if(!arg?.[0])
        return true
    
    if("name" in arg[0] && "list" in arg[0])
        return false
    
    return true
}