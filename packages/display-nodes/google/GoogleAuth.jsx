
import { useEffect, useState } from "react"
import { Button, Group, Loader, ThemeIcon } from "@mantine/core"
import { TbCheck } from "react-icons/tb"
import { GoogleIntegration } from "@minus/client-sdk"


export default function GoogleAuth({ app, requiredScopes }) {

    const [loading, setLoading] = useState(true)

    const isAuthorized = GoogleIntegration.isAppAuthorized(app, requiredScopes)

    // click handler -- launch popup with auth URL
    const handleClick = () => {
        setLoading(true)
        GoogleIntegration.authorizeAppInPopup(app.id, requiredScopes)
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
                    <ThemeIcon size="lg" color="green" radius="xl"><TbCheck size={18} /></ThemeIcon>
                    :
                    <Button onClick={handleClick}>
                        Authorize
                    </Button>}
        </Group>
    )
}
