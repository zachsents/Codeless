import { Button, Group, HoverCard, Skeleton, Stack, Text, Title, useMantineTheme } from '@mantine/core'
import { TbBook } from 'react-icons/tb'

export default function NodeInfoPopover({ children }) {

    const theme = useMantineTheme()

    return (
        <HoverCard
            width={320}
            offset={30}
            openDelay={750}
            closeDelay={200}
            position="right-start"
            // withArrow
            // arrowOffset={15}
            shadow={theme.shadows.lg}
            styles={{
                dropdown: { border: "none" },
                arrow: { border: "none" },
            }}
        >
            <HoverCard.Target>
                {children}
            </HoverCard.Target>
            <HoverCard.Dropdown>
                <Stack>
                    <Title order={5}>Send email with SendGrid</Title>
                    <Text>
                        This is the description of the node. This tells you what the node does in dept.
                    </Text>
                    <Skeleton height={100} />
                    <Group position="apart" mt={10}>
                        <Button radius="md" variant="subtle" leftIcon={<TbBook />}>View Guides</Button>
                        <Button radius="md">Add to Flow</Button>
                    </Group>
                </Stack>
            </HoverCard.Dropdown>
        </HoverCard>
    )
}
