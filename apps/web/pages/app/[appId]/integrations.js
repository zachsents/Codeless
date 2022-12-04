import { Box, Group, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core'
import { useInterval } from "@mantine/hooks"
import { Carousel } from "@mantine/carousel"
import { TbBrandAirtable, TbBrandGmail, TbBrandGoogleDrive, TbBrandInstagram, TbBrandTwitter, TbExternalLink } from 'react-icons/tb'
import { SiGooglesheets } from "react-icons/si"
import AppDashboard from '../../../components/AppDashboard'
import GlassButton from '../../../components/GlassButton'
import GradientBox from '../../../components/GradientBox'
import PageTitle from '../../../components/PageTitle'
import OurCard from "../../../components/cards/OurCard"
import { auth, firestore, functions, useMustBeSignedIn } from '../../../modules/firebase'
import { useEffect, useState } from 'react'
import GoogleSheetsAuth from "@zachsents/display-nodes/google/sheets/auth"
import { useAppRealtime } from '../../../modules/hooks'


export default function AppSettings() {

    const user = useMustBeSignedIn()
    const app = useAppRealtime()

    // auto scroll integrations carousel
    const [carousel, setCarousel] = useState()
    const carouselInterval = useInterval(() => carousel?.scrollNext(), 2000)
    useEffect(() => {
        carousel && carouselInterval.start()
        return carouselInterval.stop
    }, [carousel])

    return (
        <AppDashboard>
            <GradientBox>
                <Group position="apart" sx={{ alignItems: "stretch" }}>
                    <Box sx={{ width: "60%", maxWidth: 500, minWidth: 250 }}>
                        <PageTitle white mb={20}>Integrations</PageTitle>
                        <Text color="white">
                            Flows are more useful when you integrate your other apps. Manage them here.
                        </Text>
                    </Box>
                    <Box>
                        <Stack align="center">
                            <Carousel w={150} slideSize="33.33%" loop dragFree withControls={false} getEmblaApi={setCarousel}>
                                <Carousel.Slide>
                                    <ThemeIcon size="xl" radius="xl" color="red">
                                        <TbBrandGmail size={22} />
                                    </ThemeIcon>
                                </Carousel.Slide>
                                <Carousel.Slide>
                                    <ThemeIcon size="xl" radius="xl" color="teal.5">
                                        <SiGooglesheets size={20} />
                                    </ThemeIcon>
                                </Carousel.Slide>
                                <Carousel.Slide>
                                    <ThemeIcon size="xl" radius="xl" color="yellow">
                                        <TbBrandAirtable size={22} />
                                    </ThemeIcon>
                                </Carousel.Slide>
                                <Carousel.Slide>
                                    <ThemeIcon size="xl" radius="xl" color="pink">
                                        <TbBrandInstagram size={22} />
                                    </ThemeIcon>
                                </Carousel.Slide>
                                <Carousel.Slide>
                                    <ThemeIcon size="xl" radius="xl" color="blue">
                                        <TbBrandTwitter size={22} />
                                    </ThemeIcon>
                                </Carousel.Slide>
                            </Carousel>
                            <GlassButton rightIcon={<TbExternalLink />}>Browse Integrations</GlassButton>
                        </Stack>
                    </Box>
                </Group>
            </GradientBox>

            <SimpleGrid cols={1} spacing={35} verticalSpacing={25}>
                <IntegrationCard integration={GoogleSheetsAuth} app={app} />
            </SimpleGrid>
        </AppDashboard>
    )
}

function IntegrationCard({ integration, app }) {

    return (
        <OurCard>
            <Group position="apart">
                <Group>
                    <ThemeIcon color={integration.color ?? ""} size="xl"><integration.icon size={22} /></ThemeIcon>
                    <Text size="xl" weight={500}>{integration.title}</Text>
                </Group>
                <integration.component app={app} firestore={firestore} functions={functions} />
            </Group>
        </OurCard>
    )
}