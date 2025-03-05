const mapLobbyToLobbyResponse = (lobby) => ({
    id: lobby.id,
    players: lobby.players, 
    leader: lobby.leader,
});

const mapPlayersGameStartToSignedDecks = (players) => 
    players.map(player => ({
        username: player,
        card1: player.card1,
        card2: player.card2,
        card3: player.card3
    }));


export const mapper = {
    mapLobbyToLobbyResponse,
    mapPlayersGameStartToSignedDecks,
};
