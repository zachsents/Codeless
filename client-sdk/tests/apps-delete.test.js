import { createApp, deleteApp } from "../app-actions.js"
import { OtherUserId, TestEnvironment, UserId, setAuthenticatedContext, setUnauthenticatedContext } from "./test-init.js"


/*
 * Deleting apps is not a pure operation like the other ones, as 
 * it also reads and deletes all the flows (and flow graphs) associated 
 * with the app.
 */


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


test("Delete App (unauthenticated)", async () => {

    setUnauthenticatedContext()

    await expect(
        deleteApp(appRef.id)
    ).rejects.toThrow()
})

test("Delete App as OtherUser", async () => {

    setAuthenticatedContext(OtherUserId)

    await expect(
        deleteApp(appRef.id)
    ).rejects.toThrow()
})

test("Delete App as User", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        deleteApp(appRef.id)
    ).resolves.not.toThrow()
})