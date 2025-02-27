import { Lobby, LobbyResponse } from "./interface/lobby-interface";

const mapLobbyToLobbyResponse = (lobby: Lobby): LobbyResponse => ({
    id: lobby.id,
    players: lobby.players.map(player => player.username), 
    leader: lobby.leader,
  });
  
export const mapper = {
    mapLobbyToLobbyResponse
}