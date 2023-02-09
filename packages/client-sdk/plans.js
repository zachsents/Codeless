import { collection, doc, DocumentReference } from "firebase/firestore"
import { firestore } from "./firebase-init.js"
import { useQuery } from "react-query"
import { getDocWithId } from "./firestore-util.js"


export const PlansCollectionPath = "plans"
export const PlansCollection = () => collection(firestore, PlansCollectionPath)


/**
 * Creates a reference to a plan document.
 *
 * @export
 * @param {string} name
 */
export function getPlanRef(name) {
    return name && doc(PlansCollection(), name)
}


/**
 * Gets a plan.
 *
 * @export
 * @param {object} options
 * @param {string?} options.name
 * @param {DocumentReference?} options.ref
 */
export async function getPlan({ name, ref } = {}) {
    const planRef = ref ?? getPlanRef(name)
    return planRef && await getDocWithId(planRef)
}


/**
 * Hook that queries a plan.
 *
 * @export
 * @param {object} options
 * @param {string?} options.name
 * @param {DocumentReference?} options.ref
 */
export function usePlan({ name, ref } = {}) {

    const planRef = ref ?? getPlanRef(name)

    const { data: plan, ...result } = useQuery(
        ["plan", planRef?.id],
        () => getPlan({ ref: planRef })
    )

    return { plan, ...result }
}