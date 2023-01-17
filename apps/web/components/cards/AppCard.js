import { ActionIcon, Box, ColorSwatch, Grid, Group, Indicator, Menu, Stack, Text, useMantineTheme } from '@mantine/core'
import Link from 'next/link'
import { format as timeAgo } from 'timeago.js'
import { useFlowCount, usePlan, useUpdateApp } from "../../modules/hooks"
import { TbCrown, TbDots } from 'react-icons/tb'
import { createLinearGradient } from '../../modules/colors'


export default function AppCard({ app: { id, name, lastEdited, plan: planRef, color = "blue" } }) {

    const flowCount = useFlowCount(id)
    const plan = usePlan(planRef)
    const [updateApp] = useUpdateApp(id)

    const handleColorChange = newColor => {
        updateApp({ color: newColor })
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

    return (
        <Stack>
            <Indicator
                disabled={!plan}
                color={plan?.color}
                size={30}
                withBorder
                label={<TbCrown />}
            >
                <Link href={`/app/${id}`}>
                    <Box p="lg" sx={cardTitleContainerStyle}>
                        <Group position="apart">
                            <Text size={24} weight={500} color="white">{name}</Text>
                            <Box>
                                <Text size="sm" weight={500} align="right" color="white">{flowCount} flows</Text>
                                <Text size="sm" weight={500} align="right" color="white">3 integrations</Text>
                            </Box>
                        </Group>
                    </Box>
                </Link>
            </Indicator>

            <Grid px="md">
                <Grid.Col span="auto">
                    <Text size="xs" color="dimmed">Last edited {timeAgo(lastEdited.seconds * 1000)}</Text>
                </Grid.Col>

                <Grid.Col span="content">
                    <Menu position="bottom-end" shadow="lg" styles={{ dropdown: { border: "none" } }}>
                        <Menu.Target>
                            <ActionIcon color="gray" variant="light" radius="sm">
                                <TbDots />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <SwatchArray
                                colors={["red", "teal", "blue", "grape"]}
                                onChange={handleColorChange}
                                value={color}
                            />
                            <Menu.Item>
                                Rename
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

const swatchStyle = (active = false) => theme => ({
    cursor: "pointer",
    transform: `scale(${active ? 1.3 : 1})`,
    transition: "transform 0.1s",

    "&:hover": {
        transform: "scale(1.3)",
    }
})