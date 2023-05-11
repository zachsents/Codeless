import { addDoc, deleteDoc, updateDoc } from "firebase/firestore"
import { createApp } from "../app-actions.js"
import { createFlow } from "../flow-actions.js"
import { RunStatus, RunsCollection, getRunRef, startFlowRun } from "../run-actions.js"
import { OtherUserId, TestEnvironment, UserId, setAuthenticatedContext, setUnauthenticatedContext } from "./test-init.js"

let userAppRef, otherUserAppRef, userFlowRef, otherUserFlowRef, runId

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


test("* Run Flow (unauthenticated)", async () => {

    setUnauthenticatedContext()

    await expect(
        startFlowRun(userFlowRef.id, {})
    ).rejects.toThrow()
})

test("* Run OtherUser's Flow", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        startFlowRun(otherUserFlowRef.id, {})
    ).rejects.toThrow()
})

test("* Insert Run Document with Validated Status", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        addDoc(RunsCollection(), {
            flow: userFlowRef.id,
            payload: {},
            status: RunStatus.Validated,
            source: "client",
        })
    ).rejects.toThrow()
})

test("Run Flow", async () => {

    setAuthenticatedContext(UserId)

    const promise = startFlowRun(userFlowRef.id, {})

    await expect(promise).resolves.not.toThrow()
    runId = await promise
    expect(typeof runId).toBe("string")
})

test("* Update Run", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        updateDoc(getRunRef(runId), {
            status: RunStatus.Validated,
        })
    ).rejects.toThrow()
})

test("* Delete Run", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        deleteDoc(getRunRef(runId))
    ).rejects.toThrow()
})