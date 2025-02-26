
import { io } from "socket.io-client";
import momIcon from './icon-48x48.png'
import { SOCKET_EVENTS } from "./constants";

const serverPort = 8888;
const serverUrl = "http://localhost:" + serverPort;

function createSocketConfig() {

    const socket = io(serverUrl,{
        autoConnect: false,
        reconnection: false,
    });
    
    function sendNotification(message) {
        if (!("Notification" in window)) {
          alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            new Notification(message,{
                icon: momIcon,
            });
        } else if (Notification.permission !== "denied") {
          // We need to ask the user for permission
          Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                new Notification(message,{
                    icon: momIcon
                });
            }
          });
        }
      }


    //Metto il socket in ascolto su namespace univoco/privato, per ricevere inviti da altri giocatori
    function registerToInvite(setInfoInviterLobby, setOpenToastNotification){
        socket.on(SOCKET_EVENTS.LOBBY_INVITE ,({lobbyID, usernameInviter})=>{
            const infoInviterLobby = {
                lobbyID: lobbyID,
                usernameInviter: usernameInviter
            }
            setInfoInviterLobby(infoInviterLobby);
            setOpenToastNotification(true);
            const message = `You are invited in a lobby by ${usernameInviter}.  Would you like to join him?`;
            sendNotification(message);
        });
    }  

    function unRegisterToInvite(){
        socket.off(SOCKET_EVENTS.LOBBY_INVITE);
    } 
    
    
    function unRegisterToConnection(){
        socket.off("connect");
        socket.off("disconnect");
    }

    //connetti
    function connect(setStatusOnline,
        setInfoInviterLobby, 
        setOpenToastNotification,
        setLobby,
        setLobbyUpdated, 
        setGameStart, 
        setGameInitState, 
        setGameUpdated, 
        setGameOnNewTurn,
        setGameEndState,
        setGameEnd){
        socket.connect();
        if(socket.connected){
            setStatusOnline(true);
            registerToInvite(setInfoInviterLobby, setOpenToastNotification);
            registerToLobbyUpdate(setLobby,
                setLobbyUpdated, 
                setGameStart, 
                setGameInitState, 
                setGameUpdated, 
                setGameOnNewTurn,
                setGameEndState,
                setGameEnd
            )
            socket.on("disconnect", () => {
                setStatusOnline(false);
                unregisterToAll();   
            });
        }
    }

    function unregisterToAll(){
        unRegisterToConnection();
        unRegisterToInvite();
        unregisterToLobbyUpdate();
    }

    //disconnetti e disiscriviti dal namespace "privato"
    function disconnect(){
        unregisterToAll()
        socket.disconnect();
    }
    
    //invia l'username al server
    function sendUsername(username){
        socket.emit("username",username);
    }

   //esci dalla lobby corrente e smetti di ascoltare i "canali" della lobby
    function unregisterToLobbyUpdate(){
        socket.off(SOCKET_EVENTS.LOBBY_UPDATE);
        socket.off(SOCKET_EVENTS.GAME_START);
        socket.off(SOCKET_EVENTS.GAME_CHANGE_TURN);
        socket.off(SOCKET_EVENTS.GAME_END);
    }


   //Mi iscrivo ai cambiamenti che succedono nella lobby e passaggio di stato da lobby a game
    function registerToLobbyUpdate(
                    setLobby,
                    setLobbyUpdated, 
                    setGameStart, 
                    setGameInitState, 
                    setGameUpdated, 
                    setGameOnNewTurn,
                    setGameEndState,
                    setGameEnd
                ){
        
        //Aggiorno lobby se ha joinato qualcuno
        socket.on(SOCKET_EVENTS.LOBBY_UPDATE,(lobby)=>{
            setLobby(lobby);
            setLobbyUpdated(true);
        });

        //Mi metto in ascolto ai cambi di stato (Lobby State -> Game State)
        socket.on(SOCKET_EVENTS.GAME_START,(res)=>{
            setGameInitState(res);
            setGameStart(true);
        })

        //Mi metto in ascolto sui cambiamenti che ci sono stati nel gioco
        socket.on(SOCKET_EVENTS.GAME_CHANGE_TURN,(res)=>{
            setGameOnNewTurn(res);
            setGameUpdated(true);
        })

        //Mi metto in ascolto per la fine del gioco
        socket.on(SOCKET_EVENTS.GAME_END,(res)=>{
            setGameEndState(res);
            setGameEnd(true);
        })
    }


    return{
        connect,
        disconnect,
        sendUsername,
        socket
    }
}

export const connectionHandlerClient = createSocketConfig();