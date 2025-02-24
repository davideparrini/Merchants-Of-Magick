import { createServer } from "http";
import { Server } from "socket.io";
import { lobbyHandler } from "./Config/lobbyServerHandler";
import { gameHandler } from "./Config/gameServerHandler";
import { gameLogic } from "./Config/gameLogic";

const PORT = 8888;
const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

// Type definitions for maps
const mapLobbyID_Lobby = new Map<string, any>();
const mapUsername_socket = new Map<string, any>();
const mapSocketID_Username = new Map<string, string>();
const mapUsername_lobbyID = new Map<string, string>();
const mapLobbyID_GameState = new Map<string, any>();

function handlePlayerLeftGame(username: string): void {
  const lobbyID = mapUsername_lobbyID.get(username);
  if (lobbyID === undefined) {
    return;
  }

  const lobby = mapLobbyID_Lobby.get(lobbyID);

  if (lobby === undefined || lobby.players === undefined) {
    return;
  }

  const indexUsername = lobby.players.findIndex((u: string) => u === username);

  if (indexUsername < 0) {
    return;
  }

  lobby.players.splice(indexUsername, 1);
  lobby.leaderLobby = lobby.players[0];

  mapUsername_lobbyID.delete(username);

  console.log(username + ' wants to leave ' + lobby.leaderLobby + "'s lobby");

  switch (lobby.status) {
    case 'in-game': {
      const gameState_inGame = mapLobbyID_GameState.get(lobbyID);
      gameState_inGame.nPlayers--;
      gameState_inGame.players.splice(indexUsername, 1);
      console.log(lobby.leaderLobby + "'s lobby is in game");

      if (gameState_inGame.nPlayers === gameState_inGame.nPlayersEndTurn) {
        const cardsUpdated = gameLogic.updateCardsTurn(gameState_inGame.cards, gameState_inGame.players);
        const response = {
          quest1: gameState_inGame.quest1,
          quest2: gameState_inGame.quest2,
          dices: gameLogic.rollDices(),
          cards: cardsUpdated,
          report: gameState_inGame.report
        }
        console.log(lobby.leaderLobby + "'s lobby update turn");
        io.to(lobbyID).emit("game-change-turn", response);

        gameState_inGame.cards = [];
        gameState_inGame.report = [];
        gameState_inGame.nPlayersEndTurn = 0;
      }
      break;
    }
    case 'end-game': {
      const gameState_endGame = mapLobbyID_GameState.get(lobbyID);
      gameState_endGame.nPlayers--;
      gameState_endGame.players.splice(indexUsername, 1);
      console.log(lobby.leaderLobby + "'s lobby is ending the game");

      if (gameState_endGame.nPlayersEndTurn === gameState_endGame.nPlayers) {
        const winnerResolution = gameLogic.winnerResolution(gameState_endGame.report);
        lobby.status = 'game-over';
        io.to(lobbyID).emit("game-end", winnerResolution);
      }
      break;
    }
    default: break;
  }

  if (lobby.players.length < 1) {
    mapLobbyID_Lobby.delete(lobbyID);
    mapLobbyID_GameState.delete(lobbyID);
  }
}

io.on("connection", (socket) => {
  console.log("Connected " + socket.id);

  socket.on("username", (username: string) => {
    if (username !== '') {
      mapSocketID_Username.set(socket.id, username);
      mapUsername_socket.set(username, socket);
    }
  });

  lobbyHandler(io, socket, mapLobbyID_Lobby, mapUsername_socket, mapUsername_lobbyID, handlePlayerLeftGame);
  gameHandler(io, socket, mapLobbyID_Lobby, mapLobbyID_GameState);

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);

    const username = mapSocketID_Username.get(socket.id);

    const lobbyID = mapUsername_lobbyID.get(username);

    if (lobbyID !== undefined) {
      const lobby = mapLobbyID_Lobby.get(lobbyID);
      if (lobby !== undefined) {
        handlePlayerLeftGame(username);
        console.log(username + ' left the lobby');
        socket.broadcast.to(lobbyID).emit("lobby-player-left", username);
        socket.leave(lobbyID);
      }
    }
  });
});

httpServer.listen(PORT);
