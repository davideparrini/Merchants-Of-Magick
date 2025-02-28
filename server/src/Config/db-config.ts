import admin, { ServiceAccount } from 'firebase-admin';

import serviceAccount from './admin-key.json';
import { UnauthorizedError } from '../Errors/UnauthorizedError';


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount)
});

export const db = admin.firestore();

// Funzione per verificare il token
export const verifyToken = async (token: string) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;  
  } catch (error) {
    throw new UnauthorizedError();
  }
};