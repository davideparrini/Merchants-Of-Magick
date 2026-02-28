
import { ArchivedGame, ResolvedFinalReport } from '../interface/game-interface';
import { NotFoundError } from '../Errors/NotFoundError';

import { db } from '../Config/db-config';
import { ERRORS } from '../constants/constants';

const archivedGamesCollection = db.collection("archived-games");


const insertArchivedGame = async (lobbyID : string ,finalReports: ResolvedFinalReport[]) =>{
    const archivedGameRef = archivedGamesCollection.doc(lobbyID);
    await archivedGameRef.set({finalReports});
}

const getArchivedGame = async (lobbyID: string): Promise<ArchivedGame> => {
    
    const docRef = archivedGamesCollection.doc(lobbyID);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
        throw  new NotFoundError(ERRORS.LOBBY_NOT_FOUND);
    }
    return docSnap.data() as ArchivedGame;
}

export const repositoryArchivedGame = {
    insertArchivedGame,
    getArchivedGame
}