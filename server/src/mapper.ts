import { PlayerStartGame, SignedAdventurer, SignedDeckCards } from "./interface/game-interface";
import { Lobby, LobbyResponse } from "./interface/lobby-interface";

const mapLobbyToLobbyResponse = (lobby: Lobby): LobbyResponse => ({
    id: lobby.id,
    players: lobby.players.map(player => player.username), 
    leader: lobby.leader,
  });



const mapPlayersGameStartToSignedDecks =  (players : PlayerStartGame[] ): SignedDeckCards[] =>{
    return players.map(player => ({
        username: player.username,
        card1: player.card1,
        card2: player.card2,
        card3: player.card3
    }));
}

const mapPlayersGameStartToSignedAdventurers =  (players : PlayerStartGame[] ): SignedAdventurer[] =>{
  return players.map(player => ({
      username: player.username,
      adventurer: player.adventurer
  }));
}

export const mapper = {
    mapLobbyToLobbyResponse,
    mapPlayersGameStartToSignedDecks,
    mapPlayersGameStartToSignedAdventurers
}