import Link from "next/link"
import { format as timeAgo } from "timeago.js"
import { ActionIcon, Box, ColorSwatch, Grid, Group, Indicator, Menu, Stack, Text, useMantineTheme, Tooltip, Center } from "@mantine/core"
import { openContextModal } from "@mantine/modals"
import * as TbIcons from "react-icons/tb"
import { useFlowCountForApp, usePlan, useUpdateApp } from "@minus/client-sdk"

import { createLinearGradient } from "../../modules/colors"


export default function AppCard({ app: { id, name, lastEdited, plan: planRef, color = "blue" } }) {

    const { flowCount } = useFlowCountForApp(id)

    const { plan } = usePlan({ ref: planRef })
    const updateApp = useUpdateApp(id)

    const handleColorChange = newColor => {
        updateApp({ color: newColor })
    }

    const handleOpenDeleteModal = () => {
        openContextModal({
            modal: "DeleteApp",
            title: "Delete " + name,
            innerProps: { appId: id },
        })
    }

    const cardTitleContainerStyle = theme => ({
        background: createLinearGradient(theme.colors, color),
        borderRadius: theme.radius.lg,
        cursor: "pointer",
        transition: "transform 0.15s",
        "&:hover": {
            transform: "scale(1.02)",
        },
    })

    const PlanIcon = TbIcons[plan?.icon]

    return (
        <Stack>
            <Indicator
                disabled={!plan?.icon}
                color={plan?.color}
                size={30}
                withBorder
                offset={5}
                label={plan && <Tooltip withinPortal label={plan.name + " Plan"}>
                    <Center px={4} py="xs">
                        {PlanIcon ? <PlanIcon size={16} /> : <Text weight={600}>{plan.name.substring(0, 1).toUpperCase()}</Text>}
                    </Center>
                </Tooltip>}

            >
                <Link href={`/app/${id}`}>
                    <Box p="lg" sx={cardTitleContainerStyle}>
                        <Group position="apart" noWrap>
                            <Text size={name.length > 12 ? 20 : 24} weight={500} color="white">{name}</Text>
                            <Text size="sm" weight={500} align="right" color="white" sx={{ whiteSpace: "nowrap" }}>
                                {flowCount} flow{flowCount == 1 ? "" : "s"}
                            </Text>
                        </Group>
                    </Box>
                </Link>
            </Indicator>

            <Grid px="md">
                <Grid.Col span="auto">
                    {lastEdited &&
                        <Text size="xs" color="dimmed">Last edited {timeAgo(lastEdited.seconds * 1000)}</Text>}
                </Grid.Col>

                <Grid.Col span="content">
                    <Menu position="bottom-end" shadow="lg" styles={{ dropdown: { border: "none" } }}>
                        <Menu.Target>
                            <ActionIcon color="gray" variant="light" radius="sm">
                                <TbIcons.TbDots />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <SwatchArray
                                colors={["red", "teal", "blue", "grape"]}
                                onChange={handleColorChange}
                                value={color}
                            />
                            <Menu.Item disabled icon={<TbIcons.TbPencil />}>
                                Rename
                            </Menu.Item>
                            <Menu.Item onClick={handleOpenDeleteModal} color="red" icon={<TbIcons.TbTrash />}>
                                Delete
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Grid.Col>
            </Grid>
        </Stack>
    )
}

function SwatchArray({ colors, shade = 5, onChange, value }) {

    const theme = useMantineTheme()

    return <Group spacing="xs" px="md" py="xs">
        {colors.map(color =>
            <ColorSwatch
                size={15}
                color={theme.colors[color][shade]}
                onClick={() => onChange?.(color)}
                sx={swatchStyle(color == value)}
                key={color}
            />
        )}
    </Group>
}

const swatchStyle = (active = false) => ({
    cursor: "pointer",
    transform: `scale(${active ? 1.3 : 1})`,
    transition: "transform 0.1s",

    "&:hover": {
        transform: "scale(1.3)",
    }
})