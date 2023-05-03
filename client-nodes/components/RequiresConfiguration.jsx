import { Center, Text } from "@mantine/core"


export default function RequiresConfiguration({
    children,
    dependencies = [],
    message = "Click to configure",
    includeCenter = true,
    ...props
}) {

    const text = <Text color="dimmed" {...props}>{message}</Text>

    return dependencies.every(dep => !!dep) ?
        children :
        (includeCenter ? <Center>{text}</Center> : text)
}