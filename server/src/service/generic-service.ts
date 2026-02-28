import { repositoryPlayer } from "../repository/player-connection-repository";


const saveUsername = async (username: string, socketID:string) =>{
    await repositoryPlayer.loginPlayerSocketID(username, socketID)
}

export const genericService = {
    saveUsername
};
