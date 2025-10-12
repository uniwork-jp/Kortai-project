import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
const db = getFirestore();
if (process.env.NEXT_PUBLIC_USE_EMULATOR === "true") {
  connectFirestoreEmulator(db, "localhost", 8080);
}
export default db;
