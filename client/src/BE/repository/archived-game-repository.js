import { doc, getDoc, setDoc } from '@firebase/firestore';
import { dbFirestore } from '../../Config/FirebaseConfig';
import { NotFoundError } from '../Errors/NotFoundError';

import { ERRORS } from '../constants/constants';


const insertArchivedGame = async (lobbyID, finalReports) => {
    const archivedGameRef = doc(dbFirestore, "archived-games", lobbyID);
    await setDoc(archivedGameRef, {finalReports});
};

const getArchivedGame = async (lobbyID) => {
    const docRef = doc(dbFirestore, "archived-games",lobbyID);
    const docSnap = await getDoc(dbFirestore,docRef );
    
    if (!docSnap.exists) {
        throw new NotFoundError(ERRORS.LOBBY_NOT_FOUND);
    }
    
    return docSnap.data();
};

export const repositoryArchivedGame = {
    insertArchivedGame,
    getArchivedGame
};
