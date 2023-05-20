import Link from "next/link"
import TabPanel from "./TabPanel"
import { Box, Button, Group, Stack, Text, useMantineTheme } from "@mantine/core"
import Image from "next/image"


export default function FeatureTabPanel({ value, activeTab, title, subtitle, text, icon: Icon, docsHref = "#" }) {

    const theme = useMantineTheme()

    return (
        <TabPanel value={value} activeTab={activeTab}>
            <Stack>
                <Box>
                    <Text weight={600} size="xl">{title}</Text>
                    <Text size="md" color={theme.other.halfDimmed}>
                        {subtitle}
                    </Text>
                </Box>
                <Text size="sm">
                    {text}
                </Text>
                <Group
                    position="apart" align="flex-end"
                    className=""
                    pos="absolute" p="lg" bottom={0} left={0} right={0}
                >
                    <div className="hidden sm:block">
                        {typeof Icon === "function" &&
                            <Icon />}
                        {typeof Icon === "string" &&
                            <Image src={Icon} width={45} height={45} alt={`${value} icon`} style={{ filter: "saturate(0.7)" }} />}
                    </div>

                    <Link href={docsHref}>
                        <Button size="xs" leftIcon="📚" variant="subtle">Read the docs</Button>
                    </Link>
                </Group>
            </Stack>
        </TabPanel>
    )
}
