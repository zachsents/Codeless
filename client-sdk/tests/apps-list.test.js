import { getAppDetailsForUser } from "../app-actions.js"
import { OtherUserId, TestEnvironment, UserId, setAuthenticatedContext, setUnauthenticatedContext } from "./test-init.js"


// Setup
beforeAll(async () => {
    await TestEnvironment.clearFirestore()
})

// Teardown
afterAll(async () => {
    await TestEnvironment.cleanup()
})


test("List Apps (unauthenticated)", async () => {

    setUnauthenticatedContext()

    await expect(
        getAppDetailsForUser(UserId)
    ).rejects.toThrow()
})

test("List Apps for OtherUser", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        getAppDetailsForUser(OtherUserId)
    ).rejects.toThrow()
})

test("List Apps for User", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        getAppDetailsForUser(UserId)
    ).resolves.toBeInstanceOf(Array)
})