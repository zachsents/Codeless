import { Group, Image, Stack, Text } from "@mantine/core"
import Link from "next/link"
import { TbExternalLink } from "react-icons/tb"


export default function ArticleCard({ placeholder = 1, title }) {
    return (
        <Link href="#">
            <Stack sx={{ cursor: "pointer" }}>
                <Image
                    radius="lg"
                    src={`/article-placeholder-${placeholder}.svg`}
                    alt=""
                />

                <Group position="apart">
                    <Stack spacing={0}>
                        <Text size="md">{title}</Text>
                        <Text size="xs" color="dimmed">Minus Team</Text>
                    </Stack>
                    <Text color="dimmed">
                        <TbExternalLink />
                    </Text>
                </Group>
            </Stack>
        </Link>
    )
}
