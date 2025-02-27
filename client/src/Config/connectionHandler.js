import { io } from "socket.io-client";
import momIcon from './icon-48x48.png';
import { SOCKET_EVENTS } from "./constants";

const serverPort = 8888;
const serverUrl = `http://localhost:${serverPort}`;

const createSocketConfig = () => {
    const socket = io(serverUrl, {
        autoConnect: false,
        reconnection: false,
        transports: ["websocket"]
    });

    /** 🔔 Invia una notifica desktop */
    const sendNotification = (message) => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notifications");
        } else if (Notification.permission === "granted") {
            new Notification(message, { icon: momIcon });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(message, { icon: momIcon });
                }
            });
        }
    };

    /** 📩 Registra il listener per gli inviti */
    const registerToInvite = (setInfoInviterLobby, setOpenToastNotification) => {
        socket.on(SOCKET_EVENTS.LOBBY_INVITE, ({ lobbyID, usernameInviter }) => {
            setInfoInviterLobby({ lobbyID, usernameInviter });
            setOpenToastNotification(true);
            sendNotification(`You are invited to a lobby by ${usernameInviter}.`);
        });
    };

    /** 🏠 Registra i listener degli eventi della lobby e del gioco */
    const registerToGameEvents = (setLobby, setLobbyUpdated, setGameStart, setGameInitState, setGameUpdated, setGameOnNewTurn, setGameEndState, setGameEnd) => {
        socket.on(SOCKET_EVENTS.LOBBY_UPDATE, lobby => {
            console.log("UPDATE LOBBY", lobby);
            setLobby(lobby);
            setLobbyUpdated(true);
        });

        socket.on(SOCKET_EVENTS.GAME_START, res => {
            setGameInitState(res);
            setGameStart(true);
        });

        socket.on(SOCKET_EVENTS.GAME_CHANGE_TURN, res => {
            setGameOnNewTurn(res);
            setGameUpdated(true);
        });

        socket.on(SOCKET_EVENTS.GAME_END, res => {
            setGameEndState(res);
            setGameEnd(true);
        });
    };

    /** 🚀 Connetti e registra tutti gli eventi */
    const connect = (setStatusOnline, setInfoInviterLobby, setOpenToastNotification, setLobby, setLobbyUpdated, setGameStart, setGameInitState, setGameUpdated, setGameOnNewTurn, setGameEndState, setGameEnd) => {
        socket.connect();

        // Stato online
        socket.on("connect", () => setStatusOnline(true));
        socket.on("disconnect", () => {
            setStatusOnline(false);
            unregisterAllEvents();
        });

        // Registra tutti gli eventi necessari
        registerToInvite(setInfoInviterLobby, setOpenToastNotification);
        registerToGameEvents(setLobby, setLobbyUpdated, setGameStart, setGameInitState, setGameUpdated, setGameOnNewTurn, setGameEndState, setGameEnd);
    };

    /** ❌ Unregister da tutti gli eventi */
    const unregisterAllEvents = () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off(SOCKET_EVENTS.LOBBY_INVITE);
        socket.off(SOCKET_EVENTS.LOBBY_UPDATE);
        socket.off(SOCKET_EVENTS.GAME_START);
        socket.off(SOCKET_EVENTS.GAME_CHANGE_TURN);
        socket.off(SOCKET_EVENTS.GAME_END);
    };

    /** 📴 Disconnetti e rimuovi i listener */
    const disconnect = () => {
        unregisterAllEvents();
        socket.disconnect();
    };

    /** 🔗 Controlla se il socket è connesso */
    const checkConnected = (setStatusOnline) => {
        setStatusOnline(socket.connected);
    };

    /** 📤 Invia il proprio username al server */
    const sendUsername = (username) => {
        socket.emit("username", username);
    };

    return {
        connect,
        disconnect,
        sendUsername,
        checkConnected,
        socket,
    };
};

export const connectionHandlerClient = createSocketConfig();
