export const SOCKET_EVENTS = {
    // Events for the lobby
    LOBBY_UPDATE: "update-lobby",
    LOBBY_INVITE: "invite-player",
  
    // Events for the game
    GAME_START: "game-start",
    GAME_CHANGE_TURN: "game-change-turn",
    GAME_END: "game-end"
  
  };

  
export const ERRORS = {
    LOBBY_NOT_FOUND: "Lobby not found",
    GAME_NOT_IN_LOBBY: "Game not in lobby",
    GAME_NOT_STARTED: "Game not started",
    GAME_NOT_OVER: "Game not over",
    GAME_OVER: "Game over",
    PLAYER_ALREADY_IN_LOBBY: "Player is in a lobby",
    LOBBY_FULL: "Lobby is full",
    PLAYER_NOT_FOUND: "Player not found in lobby",
    PLAYER_KICKED: "Player was kicked in lobby",
    NOT_LOBBY_LEADER: "Only the leader can kick players"
} ;

  export const BASE_URL_SERVER = "http://localhost:8888"; 