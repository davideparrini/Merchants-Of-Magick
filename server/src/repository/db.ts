import { initializeFirestore, memoryLocalCache } from "firebase/firestore";
import { firebase } from "../Config/firebase-config";

export const db = initializeFirestore(firebase, { localCache: memoryLocalCache()  });

