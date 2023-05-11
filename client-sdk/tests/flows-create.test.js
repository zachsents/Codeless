import { createApp } from "../app-actions.js"
import { createFlow } from "../flow-actions.js"
import { OtherUserId, TestEnvironment, UserId, setAuthenticatedContext, setUnauthenticatedContext } from "./test-init.js"

let userAppRef
let otherUserAppRef

// Setup
beforeAll(async () => {
    await TestEnvironment.clearFirestore()

    // Create apps to test with
    setAuthenticatedContext(UserId)
    userAppRef = await createApp({
        name: "User's App",
        ownerIds: [UserId],
    })

    setAuthenticatedContext(OtherUserId)
    otherUserAppRef = await createApp({
        name: "OtherUser's App",
        ownerIds: [OtherUserId],
    })
})

// Teardown
afterAll(async () => {
    await TestEnvironment.cleanup()
})


test("* Create Flow (unauthenticated)", async () => {

    setUnauthenticatedContext()

    await expect(
        createFlow({
            appId: userAppRef.id,
            name: "Create Flow (unauthenticated)",
            trigger: "trigger:test",
        })
    ).rejects.toThrow()
})

test("* Create Flow as User for App owned by OtherUser", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        createFlow({
            appId: otherUserAppRef.id,
            name: "Create Flow as User for App owned by OtherUser",
            trigger: "trigger:test",
        })
    ).rejects.toThrow()
})

test("* Create Flow as User with invalid parameters", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        createFlow({
            appId: userAppRef.id,
            name: "Create Flow as User with invalid parameters",
        })
    ).rejects.toThrow()
})

test("Create Flow as User", async () => {

    setAuthenticatedContext(UserId)

    await expect(createFlow({
        appId: userAppRef.id,
        name: "Create Flow as User",
        trigger: "trigger:test",
    })).resolves.toHaveLength(2)
})
