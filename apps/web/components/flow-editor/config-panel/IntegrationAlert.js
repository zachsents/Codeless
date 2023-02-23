import { Alert, Group, Loader, Center, Button } from "@mantine/core"

import { useAppId } from "../../../modules/hooks"


export default function IntegrationAlert({ integration: int }) {

    const appId = useAppId()

    if (int.status.isFetching)
        return (
            <Alert
                title={<Group>
                    <Loader size="sm" />
                    <AlertTitle name={int.name} icon={<int.icon />} />
                </Group>}
                color="gray"
                pb={5}
                key={int.id}
            />
        )

    if (int.status.data)
        return (
            <Alert
                pb={5}
                title={<AlertTitle name={int.name} icon={<int.icon />} prefix="Connected to " />}
                color="green"
                key={int.id}
            />
        )

    const connectIntegration = () => int.manager.oneClickAuth(appId)

    return (
        <Alert title="Integration Required!" color="red" key={int.id}>
            This node uses <b>{int.name}</b>.
            <Center mt="xs">
                <Button compact color={int.color} onClick={connectIntegration}>
                    <AlertTitle name={int.name} icon={<int.icon />} prefix="Connect " />
                </Button>
            </Center>
        </Alert>
    )
}


function AlertTitle({ icon, name, prefix = "" }) {
    return <Group spacing={5}>{prefix}{icon} {name}</Group>
}