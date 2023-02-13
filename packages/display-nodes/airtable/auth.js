import { AirTableIntegration } from "@minus/client-sdk"
import { useEffect, useState } from "react"
import { Group, Loader, Button, ThemeIcon } from "@mantine/core"
import { BrandAirtable, Check } from "tabler-icons-react"


export default {
    title: "AirTable",
    icon: BrandAirtable,
    color: "yellow",
    component: AirTableAuth,
}


function AirTableAuth({ app }) {

    const [loading, setLoading] = useState(true)

    const isAuthorized = AirTableIntegration.isAppAuthorized(app)

    // click handler -- launch popup with auth URL
    const handleClick = () => {
        setLoading(true)
        AirTableIntegration.authorizeAppInPopup(app.id)
    }

    // when app is loaded or authorization state changes, clear loading state
    useEffect(() => {
        app && setLoading(false)
    }, [typeof app, isAuthorized])

    return (
        <Group pr="xl">
            {loading ?
                <Loader size="sm" />
                :
                isAuthorized ?
                    <ThemeIcon size="lg" color="green" radius="xl"><Check size={18} /></ThemeIcon>
                    :
                    <Button onClick={handleClick}>
                        Authorize
                    </Button>}
        </Group>
    )
}
