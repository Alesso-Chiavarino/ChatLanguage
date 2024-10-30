// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyCQvDdcnOYpzERqNLtS8THuXHd99VxOlvg",
    authDomain: "chatlanguage-ca3b1.firebaseapp.com",
    projectId: "chatlanguage-ca3b1",
    storageBucket: "chatlanguage-ca3b1.appspot.com",
    messagingSenderId: "558916353742",
    appId: "1:558916353742:web:425a6a5f9bf069866dda9f",
    measurementId: "G-YBT5FLR4L6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
export { auth, provider, db };

