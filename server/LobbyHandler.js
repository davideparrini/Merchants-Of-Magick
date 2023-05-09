
import { v4 as uuid } from 'uuid';

function lobbyConnectionHandler(io,socket,lobbies, mapUsername_Socket, mapUsername_lobbyIndex) {

    //l'utente crea la lobby assegnando un id random, la cb permette di passare la lobby creata all'utente
    function create(username, cb){
        const lobby ={
            id : uuid(),
            players : [username],
            leaderLobby : username
        } 
        mapUsername_lobbyIndex.set(username,lobbies.length)
        lobbies.push(lobby);
        socket.join(lobby.id);
        cb(lobby);

    }

    //l'utente joina una lobby tramite ID e con la cb diamo un messaggio di feedback e la lobby joinata
    function join(lobbyID, username,cb){
        const indexLobby = lobbies.findIndex((lobby)=> lobby.id === lobbyID);
        if (indexLobby >= 0){
            const lobby = lobbies[indexLobby];
            if(lobby.players.length >= 8){
                cb("FULL",null)
            }else{
                lobby.players.push(username);
                mapUsername_lobbyIndex.set(username,indexLobby);
                socket.join(lobby.id);
                //dico alla lobby che si è connesso un utente e gli passo l'username
                io.to(lobby.id).emit("lobby-player-joined",username);
                cb("OK",lobby);
            }
        }
        else{
            cb("ERROR",null)
        }
    }

    //permette di invitare un utente tramite l'username, la callback da solo un messaggio di feedback
    function invitePlayer(lobbyID, usernameInvited, cb){
        const userSocket = mapUsername_Socket.get(usernameInvited);
        if(userSocket !== undefined){
            if(mapUsername_lobbyIndex.has(usernameInvited)){
                cb("ALREADY_IN_A_LOBBY");
            }
            else{
                const indexLobby = lobbies.findIndex((lobby)=> lobby.id === lobbyID);
                if(indexLobby >= 0){
                    const lobby = lobbies[indexLobby];
                    if(lobby.players.length >= 8){
                        cb("FULL")
                    }else{
                        lobby.players.push(usernameInvited);
                        mapUsername_lobbyIndex.set(usernameInvited,indexLobby);
                        userSocket.join(lobby.id);
                        //comunico all'utente che fa parte della lobby e gli spedisco la lobby, tramite il namespace registrato all'inizio della connessione
                        // dell' utente
                        io.emit("invite" + userSocket.id, lobby);
                        //comunico alla lobby che si è unito un utente e mando il suo username
                        io.to(lobby.id).emit("lobby-player-joined",usernameInvited);
                        cb("OK")
                    }
                }else {
                    cb("ERROR");
                }
            }
        }
    }

    //utente esce dalla lobby, cb = messaggio di feedback
    function leave(username, cb){
        const indexLobby = mapUsername_lobbyIndex.get(username);
        if (indexLobby != undefined){
            const lobby = lobbies[indexLobby];
            const indexUsername = lobby.players.findIndex((u)=> u === username);
            if(indexUsername >= 0){
                lobby.players.splice(indexUsername,1);
                if(lobby.leaderLobby === username && lobby.players.length > 0){
                    //se l'utente è il leader della lobby sposto il leader a qualcun'altro
                    lobby.leaderLobby = lobby.players[0];
                }
                mapUsername_lobbyIndex.delete(username);
                if(lobby.players.length < 1){
                    //se l'utente è ultimo membro della lobby, elimino la lobby
                    lobbies.splice(indexLobby,1);
                }
            }
            socket.leave(lobby.id);
            io.to(lobby.id).emit("lobby-player-left",username);
            cb("OK");
        }
        else{
            cb("ERROR");
        }
    }



    socket.on("create-lobby", create);
    socket.on("join-lobby", join);
    socket.on("leave-lobby", leave);
    socket.on("invite-player", invitePlayer);
}

export const lobbyHandler = lobbyConnectionHandler;