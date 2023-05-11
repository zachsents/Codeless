import { createApp, getAppDetails } from "../app-actions.js"
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


test("Get App (unauthenticated)", async () => {

    setUnauthenticatedContext()

    await expect(
        getAppDetails(appRef.id)
    ).rejects.toThrow()
})

test("Get App as OtherUser", async () => {

    setAuthenticatedContext(OtherUserId)

    await expect(
        getAppDetails(appRef.id)
    ).rejects.toThrow()
})

test("Get App as User", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        getAppDetails(appRef.id)
    ).resolves.not.toThrow()
})