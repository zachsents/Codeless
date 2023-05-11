import { createApp } from "../app-actions.js"
import { createFlow, getFlow, getFlowsForApp } from "../flow-actions.js"
import { OtherUserId, TestEnvironment, UserId, setAuthenticatedContext, setUnauthenticatedContext } from "./test-init.js"

let userAppRef, otherUserAppRef, userFlowRef, otherUserFlowRef

// Setup
beforeAll(async () => {
    await TestEnvironment.clearFirestore()

    // Create apps & flows to test with
    setAuthenticatedContext(UserId)
    userAppRef = await createApp({
        name: "User's App",
        ownerIds: [UserId],
    })
    userFlowRef = (await createFlow({
        appId: userAppRef.id,
        name: "User's Flow",
        trigger: "trigger:test",
    }))[0]

    setAuthenticatedContext(OtherUserId)
    otherUserAppRef = await createApp({
        name: "OtherUser's App",
        ownerIds: [OtherUserId],
    })
    otherUserFlowRef = (await createFlow({
        appId: otherUserAppRef.id,
        name: "OtherUser's Flow",
        trigger: "trigger:test",
    }))[0]
})

// Teardown
afterAll(async () => {
    await TestEnvironment.cleanup()
})


test("* List Flows (unauthenticated)", async () => {

    setUnauthenticatedContext()

    await expect(
        getFlowsForApp(userAppRef.id)
    ).rejects.toThrow()
})

test("* List Flows for OtherUser's App", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        getFlowsForApp(otherUserAppRef.id)
    ).rejects.toThrow()
})

test("List Flows", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        getFlowsForApp(userAppRef.id)
    ).resolves.toHaveLength(1)
})


test("* Get Flow (unauthenticated)", async () => {

    setUnauthenticatedContext()

    await expect(
        getFlow(userFlowRef.id)
    ).rejects.toThrow()
})

test("* Get OtherUser's Flow", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        getFlow(otherUserFlowRef.id)
    ).rejects.toThrow()
})

test("Get Flow", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        getFlow(userFlowRef.id)
    ).resolves.toHaveProperty("name", "User's Flow")
})
