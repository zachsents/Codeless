import { getDoc, getDocs, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"


export function docDataWithId(doc) {
    return doc.exists() && {
        id: doc.id,
        ...doc.data(),
    }
}


export async function getDocWithId(ref) {
    return ref && docDataWithId(await getDoc(ref))
}


export async function getDocsWithIds(ref) {
    const snapshot = await getDocs(ref)
    return snapshot.docs.map(docDataWithId)
}


export function useRealtime(ref, {
    selector,
} = {}) {
    const [state, setState] = useState()
    
    useEffect(() => {
        if (ref)
            return onSnapshot(ref, snap => {
                setState(
                    // Try in this order:
                    //  1. passed selector function
                    //  2. map multiple docs with standard selector
                    //  3. map single doc with standard selector
                    selector?.(snap) ?? snap.docs?.map(docDataWithId) ?? docDataWithId(snap)
                )
            })
    }, [!!ref])

    return [state]
}
