import { doc, updateDoc } from "firebase/firestore"
import { firestore } from "./firebase"

export function plural(count) {
    if(count > 1)
        return "s"
}