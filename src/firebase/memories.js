import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";


export async function saveMemory(playerName, imageUrl) {
  await addDoc(collection(db, "memories"), {
    uploader: playerName,
    image: imageUrl,
    createdAt: serverTimestamp(),
  });
}