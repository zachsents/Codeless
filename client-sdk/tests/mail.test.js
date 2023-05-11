import { addDoc, collection, getDoc } from "firebase/firestore"
import { firestore } from "../firebase-init.js"
import { TestEnvironment, UserId, setAuthenticatedContext, setUnauthenticatedContext } from "./test-init.js"

let mailDocRef

// Setup
beforeAll(async () => {
    await TestEnvironment.clearFirestore()
})

// Teardown
afterAll(async () => {
    await TestEnvironment.cleanup()
})

const TestEmail = {
    to: "zachsents@gmail.com",
    subject: "Test Email",
    body: "This is a test email.",
}

test("* Create Mail Document (unauthenticated)", async () => {

    setUnauthenticatedContext()

    await expect(
        addDoc(collection(firestore, "mail"), TestEmail)
    ).rejects.toThrow()
})

test("Create Mail Document", async () => {

    setAuthenticatedContext(UserId)

    const promise = addDoc(collection(firestore, "mail"), TestEmail)
    await expect(promise).resolves.not.toThrow()
    mailDocRef = await promise
})

test("* Read Mail Document", async () => {

    setAuthenticatedContext(UserId)

    await expect(
        getDoc(mailDocRef)
    ).rejects.toThrow()
})