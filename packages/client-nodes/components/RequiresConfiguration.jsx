import { Center, Text } from "@mantine/core"


export default function RequiresConfiguration({ 
    children, 
    dependencies = [], 
    message = "Click to configure" 
}) {

    return dependencies.every(dep => !!dep) ?
        children :
        <Center>
            <Text color="dimmed" size="xs">{message}</Text>
        </Center>
}