import { updateApp, createApp } from "../app-actions.js"
import { OtherUserId, TestEnvironment, UserId, setAuthenticatedContext, setUnauthenticatedContext } from "./test-init.js"


let appRef

// Setup
beforeAll(async () => {
    await TestEnvironment.clearFirestore()

    setAuthenticatedContext(UserId)
    appRef = await createApp({
        name: "Update Test",
        ownerIds: [UserId],
    })
})

// Teardown
afterAll(async () => {
    await TestEnvironment.cleanup()
})


test("Update App (unauthenticated)", async () => {

    setUnauthenticatedContext()

    await expect(
        updateApp(appRef.id, {
            color: "grape",
        })
    ).rejects.toThrow()
})

test("Update User's App as OtherUser", async () => {

    setAuthenticatedContext(OtherUserId)

    await expect(
        updateApp(appRef.id, {
            color: "grape",
        })
    ).rejects.toThrow()
})

test("Update App as User", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        updateApp(appRef.id, {
            color: "grape",
        })
    ).resolves.not.toThrow()
})

test("Update App as User with Integrations", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        updateApp(appRef.id, {
            integrations: ["some integration"],
        })
    ).rejects.toThrow()
})