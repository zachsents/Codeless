import { forwardRef, Fragment, useEffect, useState } from "react"
import { ActionIcon, Box, Button, Grid, Group, Stack, Text, TextInput, Tooltip, Loader, ThemeIcon, Flex } from "@mantine/core"
import { ArrowRight, Check, InfoCircle, Plus, X } from "tabler-icons-react"
import produce from "immer"


export function ControlStack({ children, ...props }) {
    return (
        <Stack {...props}>
            {children}
        </Stack>
    )
}

export function ControlLabel({ children, bold = false, info }) {
    return (
        <Group position="apart">
            <Text size="sm" weight={bold ? 500 : 400}>{children}</Text>
            {info &&
                <Tooltip
                    label={typeof info == "string" ?
                        <Text maw={300}>{info}</Text> : info}
                    position="left"
                    multiline
                    maw={500}
                >
                    <Text color="dimmed" size="sm" mb={-5}><InfoCircle size={15} /></Text>
                </Tooltip>}
        </Group>
    )
}

export function Control({ children, ...props }) {
    return (
        <Stack spacing={5} {...props}>
            {children}
        </Stack>
    )
}

export const SkeletonWithHandle = forwardRef(({ align = "left", h = 15, ...props }, ref) => {

    return (
        <Box
            w="100%"
            justify="center"
            align="center"
            sx={{ position: "relative" }}
            ref={ref}
        >
            <Box
                sx={theme => ({
                    width: "100%",
                    height: h,
                    backgroundColor: theme.colors.gray[2],
                    borderRadius: h / 2,
                })}
            ></Box>
            <Box
                sx={theme => ({
                    width: align == "both" ? `calc(100% + ${theme.spacing.md * 2}px)` : theme.spacing.md + 10,
                    height: 3,
                    position: "absolute",
                    top: "50%",
                    [align == "right" ? "right" : "left"]: -theme.spacing.md,
                    transform: "translateY(-50%)",
                    background: theme.colors.gray[2],
                })}
            ></Box>
        </Box>
    )
})


export function ListHandlesNodeContent({
    handleName,
    listHandles,
    alignHandles,
    state,
    arrowSide = "in",
    emptyMessage = "Nothing specified",
    unnamedMessage = "<none>",
    stateKey = "dataLabels",
}) {

    const numberOfItems = listHandles.handles?.[handleName] ?? 0

    return numberOfItems ?
        <Stack spacing="xs">
            {Array(numberOfItems).fill(0).map((_, i) =>
                <Group
                    position={arrowSide == "out" ? "right" : "left"}
                    spacing="xs"
                    ref={el => alignHandles(`${handleName}.${i}`, el)}
                    key={handleName + i}
                >
                    {arrowSide == "in" && <ArrowRight size={14} />}
                    <Text>
                        {state[stateKey]?.[i] || (typeof unnamedMessage === "function" ? unnamedMessage(i) : unnamedMessage)}
                    </Text>
                    {arrowSide == "out" && <ArrowRight size={14} />}
                </Group>
            )}
        </Stack>
        :
        <Text size="xs" color="dimmed" align="center">{emptyMessage}</Text>
}



export function ListHandlesControl({
    handleName,
    listHandles,
    state,
    setState,
    stateKey = "dataLabels",
    controlTitle,
    controlInfo,
    addLabel,
    inputPlaceholder,
}) {

    const handleRemove = i => {
        listHandles.remove(handleName, i)
        setState({
            [stateKey]: produce(state[stateKey], draft => {
                draft.splice(i, 1)
            })
        })
    }

    return (
        <Control>
            <ControlLabel info={controlInfo}>
                {controlTitle}
            </ControlLabel>

            <Grid align="center">
                {Array(listHandles.handles?.[handleName] ?? 0).fill(0).map((_, i) =>
                    <Fragment key={handleName + i}>
                        <Grid.Col span={10}>
                            <TextInput
                                placeholder={inputPlaceholder}
                                radius="md"
                                value={state[stateKey]?.[i] ?? ""}
                                onChange={event => setState({
                                    [stateKey]: produce(state[stateKey], draft => {
                                        draft[i] = event.currentTarget.value
                                    })
                                })}
                            />
                        </Grid.Col>

                        <Grid.Col span={2}>
                            <ActionIcon
                                radius="md"
                                color="red"
                                onClick={() => handleRemove(i)}
                            >
                                <X size={14} />
                            </ActionIcon>
                        </Grid.Col>
                    </Fragment>
                )}
            </Grid>

            <Button
                mt="xs"
                size="xs"
                compact
                fullWidth
                radius="sm"
                leftIcon={<Plus size={14} />}
                variant="subtle"
                onClick={() => listHandles.add(handleName)}
            >
                {addLabel}
            </Button>
        </Control>
    )
}


export function OAuthIntegration({ app, manager }) {

    const [loading, setLoading] = useState(true)

    const isAuthorized = manager.isAppAuthorized(app)

    const handleConnect = () => {
        setLoading(true)
        manager.authorizeAppInPopup(app.id)
    }

    const handleDisconnect = () => {
        setLoading(true)
        manager.revoke(app.id)
    }

    // when app is loaded or authorization state changes, clear loading state
    useEffect(() => {
        app && setLoading(false)
    }, [typeof app, isAuthorized])

    return (
        <Box pr="md">
            {loading ?
                <Loader size="sm" />
                :
                isAuthorized ?
                    <Group>
                        <Stack spacing="xs">
                            <Text color="green">Connected!</Text>
                            <Button
                                onClick={handleDisconnect}
                                size="xs"
                                compact
                                variant="light"
                                color="gray"
                            >
                                Disconnect
                            </Button>
                        </Stack>
                        <ThemeIcon size="lg" color="green" radius="xl"><Check size={18} /></ThemeIcon>
                    </Group>
                    :
                    <Button onClick={handleConnect}>
                        Connect
                    </Button>}
        </Box>
    )
}