import { io } from "socket.io-client";
import momIcon from './icon-48x48.png';
import { BASE_URL_SERVER, SOCKET_EVENTS } from "./constants";
import { apiMOM } from "../api/mom-api";



const createSocketConfig = () => {
    const socket = io(BASE_URL_SERVER, {
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
    const connect = (setStatusOnline, setInfoInviterLobby, setOpenToastNotification, setLobby, setLobbyUpdated, setGameStart, setGameInitState, setGameUpdated, setGameOnNewTurn, setGameEndState, setGameEnd, setSocketID ,username) => {
        socket.connect();

        // Stato online
        socket.on("connect", async () => {
            const res = await apiMOM.sendUsername(username, socket.id);
            if(res.statusCode === 200){
                setStatusOnline(true)
                // Registra tutti gli eventi necessari
                registerToInvite(setInfoInviterLobby, setOpenToastNotification);
                registerToGameEvents(setLobby, setLobbyUpdated, setGameStart, setGameInitState, setGameUpdated, setGameOnNewTurn, setGameEndState, setGameEnd);
            }
            setSocketID(socket.id);
        });
        socket.on("disconnect", () => {
            setStatusOnline(false);
            unregisterAllEvents();
        });

        
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

  

    return {
        connect,
        disconnect,
        checkConnected,
        socket,
    };
};

export const connectionHandlerClient = createSocketConfig();
