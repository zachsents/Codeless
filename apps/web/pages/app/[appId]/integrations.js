import { useEffect, useState } from "react"
import { Box, Group, Stack, Text, ThemeIcon } from "@mantine/core"
import { useInterval } from "@mantine/hooks"
import { Carousel } from "@mantine/carousel"
import { TbBrandAirtable, TbBrandGmail, TbBrandInstagram, TbBrandTwitter, TbExternalLink } from "react-icons/tb"
import { SiGooglesheets } from "react-icons/si"
import { useAppDetailsRealtime } from "@minus/client-sdk"
import { Integrations } from "@minus/client-nodes"

import { useAppId, useMustBeSignedIn } from "../../../modules/hooks"
import AppDashboard from "../../../components/AppDashboard"
import GlassButton from "../../../components/GlassButton"
import GradientBox from "../../../components/GradientBox"
import PageTitle from "../../../components/PageTitle"
import OurCard from "../../../components/cards/OurCard"
import Search from "../../../components/Search"


const IntegrationsList = Object.values(Integrations)


export default function AppSettings() {

    useMustBeSignedIn()

    const appId = useAppId()
    const [app] = useAppDetailsRealtime(appId)

    // auto scroll integrations carousel
    const [carousel, setCarousel] = useState()
    const carouselInterval = useInterval(() => carousel?.scrollNext(), 2000)
    useEffect(() => {
        carousel && carouselInterval.start()
        return carouselInterval.stop
    }, [carousel])

    return (
        <AppDashboard>
            <Stack spacing="xl">
                <GradientBox centerAround={app?.color ?? null}>
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

                <Search
                    list={IntegrationsList}
                    selector={int => int.name}
                    noun="integration"
                    component={IntegrationCard}
                    componentItemProp="integration"
                    componentProps={{ app }}
                />
            </Stack>
        </AppDashboard>
    )
}


function IntegrationCard({ integration, app }) {

    return (
        <OurCard>
            <Group position="apart" h="100%">
                <Group>
                    <ThemeIcon color={integration.color ?? ""} size="xl"><integration.icon size={22} /></ThemeIcon>
                    <Text size="xl" weight={500}>{integration.name}</Text>
                </Group>
                <integration.render app={app} />
            </Group>
        </OurCard>
    )
}