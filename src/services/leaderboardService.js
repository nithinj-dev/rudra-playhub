import { db } from "../firebase/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function saveScore(player, game, score) {
  try {
    const ref = doc(db, "leaderboard", player);

    const snap = await getDoc(ref);

    let data = {};

    if (snap.exists()) {
      data = snap.data();
    }

    // Keep only the BEST score
    const previous = data[game] || 0;

    if (score > previous) {
      data[game] = score;
    }

    const total =
      (data.reactionTime || 0) +
      (data.catchBug || 0) +
      (data.memoryMatch || 0) +
      (data.findLogo || 0);

    await setDoc(
      ref,
      {
        player,
        ...data,
        totalScore: total,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log("✅ Score Updated");
  } catch (err) {
    console.error(err);
  }
}