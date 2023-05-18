import { ActionIcon, ColorSwatch, Group, Menu, useMantineTheme } from "@mantine/core"
import { openContextModal } from "@mantine/modals"
import { useUpdateApp } from "@minus/client-sdk"
import { useAppContext } from "@web/modules/context"
import { jc, stopPropagation } from "@web/modules/util"
import Link from "next/link"
import { TbArrowRight, TbDots, TbPencil, TbTrash } from "react-icons/tb"


export default function AppMenu({ app, startRename, includeOpen = true }) {

    if (app === null)
        // eslint-disable-next-line react-hooks/rules-of-hooks
        app = useAppContext()?.app

    // deleting an app
    const openDeleteModal = () => openContextModal({
        modal: "DeleteApp",
        title: "Delete " + app?.name,
        innerProps: { appId: app?.id },
    })

    // changing the color of an app
    const updateApp = useUpdateApp(app?.id)
    const changeColor = color => {
        updateApp({ color })
    }

    return (
        <Menu withinPortal>
            <Menu.Target>
                <ActionIcon onClick={stopPropagation}>
                    <TbDots />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown miw="10rem" onClick={stopPropagation}>
                <SwatchArray
                    colors={["pink", "yellow", "teal", "indigo"]}
                    onChange={changeColor}
                    value={app?.color}
                />
                {includeOpen &&
                    <Menu.Item icon={<TbArrowRight />} component={Link} href={`apps/${app?.id}`}>
                        Open
                    </Menu.Item>}
                <Menu.Item icon={<TbPencil />} onClick={startRename}>
                    Rename
                </Menu.Item>
                <Menu.Item icon={<TbTrash />} color="red" onClick={openDeleteModal}>
                    Delete App
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}


function SwatchArray({ colors, shade = 5, onChange, value }) {

    const theme = useMantineTheme()

    return <Group spacing="xs" p="xs" position="center">
        {colors.map(color =>
            <ColorSwatch
                size="1rem"
                color={theme.colors[color][shade]}
                onClick={() => onChange?.(color)}
                className={jc(
                    "cursor-pointer hover:scale-125 active:scale-110 transition",
                    color == value && "scale-125 ring-2 ring-offset-2 ring-offset-white ring-gray-500"
                )}
                key={color}
            />
        )}
    </Group>
}