import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function saveMemory(name, imageUrl) {
  await addDoc(collection(db, "memories"), {
    name,
    imageUrl,
    createdAt: serverTimestamp(),
  });
}