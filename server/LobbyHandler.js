
import { v4 as uuid } from 'uuid';

function lobbyConnectionHandler(io,socket,lobbies, mapUsername_Socket, mapUsername_lobbyIndex) {

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
    function join(lobbyID, username,cb){
        const indexLobby = lobbies.findIndex((lobby)=> lobby.id === lobbyID);
        if (indexLobby >= 0){
            const lobby = lobbies[indexLobby];
            if(lobby.players.length >= 8){
                cb("FULL",null)
            }else{
                lobby.players.push(username);
                socket.join(lobby.id);
                io.to(lobby.id).emit("lobby-player-joined",username);
                cb("OK",lobby);
            }
        }
        else{
            cb("ERROR",null)
        }
    }

    function invitePlayer(lobbyID, usernameToInvite, cb){
        const userSocket = mapUsername_Socket.get(usernameToInvite);
        if(userSocket !== undefined){
            if(mapUsername_lobbyIndex.has(usernameToInvite)){
                cb("ALREADY_IN_A_LOBBY");
            }
            else{
                const indexLobby = lobbies.findIndex((lobby)=> lobby.id === lobbyID);
                if(indexLobby >= 0){
                    const lobby = lobbies[indexLobby];
                    if(lobby.players.length >= 8){
                        cb("FULL")
                    }else{
                        lobby.players.push(usernameToInvite);
                        userSocket.join(lobby.id);
                        io.emit("invite" + userSocket.id, lobby);
                        io.to(lobby.id).emit("lobby-player-joined",usernameToInvite);
                        cb("OK")
                    }
                }else {
                    cb("ERROR");
                }
            }
        }
    }

    function leave(username, cb){
        const indexLobby = mapUsername_lobbyIndex.get(username);
        if (indexLobby != undefined){
            const lobby = lobbies[indexLobby];
            const indexUsername = lobby.players.findIndex((u)=> u === username);
            if(indexUsername >= 0){
                lobby.players.splice(indexUsername,1);
                if(lobby.leaderLobby === username && lobby.players.length > 0){
                    lobby.leaderLobby = lobby.players[0];
                }
                mapUsername_lobbyIndex.delete(username);
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