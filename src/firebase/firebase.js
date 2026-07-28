import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC60gMSev4WQQ74RJRaM2SGTVnwShqQ5AE",
  authDomain: "rudra-playhub.firebaseapp.com",
  projectId: "rudra-playhub",
  storageBucket: "rudra-playhub.firebasestorage.app",
  messagingSenderId: "323282424777",
  appId: "1:323282424777:web:d895d86c5a67880e264e18"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);