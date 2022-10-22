// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAOd8KS-9mEd0oPBSpH9x25fOo0b5RwPYo",
    authDomain: "nameless-948a8.firebaseapp.com",
    projectId: "nameless-948a8",
    storageBucket: "nameless-948a8.appspot.com",
    messagingSenderId: "526708433703",
    appId: "1:526708433703:web:aaf6896df75e734d19bf02",
    measurementId: "G-0ZD6KY1LX8"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const firestore = getFirestore(app)
export const auth = getAuth(app)