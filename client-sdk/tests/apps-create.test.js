import { DocumentReference } from "firebase/firestore"
import { createApp } from "../app-actions.js"
import { OtherUserId, TestEnvironment, UserId, setAuthenticatedContext, setUnauthenticatedContext } from "./test-init.js"


// Setup
beforeAll(async () => {
    await TestEnvironment.clearFirestore()
})

// Teardown
afterAll(async () => {
    await TestEnvironment.cleanup()
})


test("Create App (unauthenticated)", async () => {

    setUnauthenticatedContext()

    await expect(
        createApp({
            name: "Create App (unauthenticated)",
            ownerIds: [UserId],
        })
    ).rejects.toThrow()
})

test("Create App as User for OtherUser", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        createApp({
            name: "Create App as User for OtherUser",
            ownerIds: [OtherUserId],
        })
    ).rejects.toThrow()
})

test("Create App as User with integrations", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        createApp({
            name: "Create App as User with integrations",
            ownerIds: [UserId],
            integrations: ["some integration"],
        })
    ).rejects.toThrow()
})

test("Create App as User", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        createApp({
            name: "Create App as User",
            ownerIds: [UserId],
        })
    ).resolves.toBeInstanceOf(DocumentReference)
})