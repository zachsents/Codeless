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
    dependencies,
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
    }, dependencies ?? [!!ref])

    return [state]
}



/*

TO DO: implement useRealtime with React Query. This will make it so we can use useFlowRealtime and
the other realtime hooks without having to worry about accidentally setting up multiple subscriptions.
ReactQuery will cache the data and only subscribe once. For now, we just need to make sure it's only
getting called once and pass the data via context, which is a fine solution, but could be better.

ChatGPT generated this:

const useFirestoreRealtimeQuery = (collectionPath, documentId) => {
  const queryClient = useQueryClient()

  const queryKey = ["firestore-realtime", collectionPath, documentId]

  const { data } = useQuery(queryKey, () => {
    const docRef = firebase.firestore().collection(collectionPath).doc(documentId)

    return docRef.get().then((doc) => doc.data())
  })

  useEffect(() => {
    const docRef = firebase.firestore().collection(collectionPath).doc(documentId)

    const unsubscribe = docRef.onSnapshot((doc) => {
      const data = doc.data()
      queryClient.setQueryData(queryKey, data)
    })

    return () => unsubscribe()
  }, [collectionPath, documentId, queryClient, queryKey])

  return data
}

 */