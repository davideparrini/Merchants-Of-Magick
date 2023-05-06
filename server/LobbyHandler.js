
import { v4 as uuid } from 'uuid';

function lobbyConnectionHandler(io,socket,lobbies,mapUsernames_lobbyIndex) {

    function create(username, cb){
        const lobby ={
            id : uuid(),
            players : [username],
            leaderLobby : username
        } 
        mapUsernames_lobbyIndex.set(username,lobbies.length)
        lobbies.push(lobby);
        socket.join(lobby.id);
        cb(lobby);

    }
    function join(lobbyID, username,cb){
        const index = lobbies.findIndex((lobby)=> lobby.id === lobbyID);
        if (index >= 0){
            const lobby = lobbies[index];
            if(lobby.players.length >= 8){
                cb("FULL",null)
            }else{
                lobby.players.push(username);
                socket.join(lobby.id);
                io.to(lobby.id).emit("lobby-player-joined",username);
                cb("OK",lobby)
            }
        }
        else{
            cb("ERROR",null)
        }
    }


    function leave(username, cb){
        const indexLobby = mapUsernames_lobbyIndex.get(username);
        if (indexLobby != undefined){
            const lobby = lobbies[indexLobby];
            const indexUsername = lobby.findIndex((u)=> u === username);
            if(indexUsername >= 0){
                lobby.splice(indexUsername,1);
                if(lobby.leaderLobby === username && lobby.length > 0){
                    lobby.leaderLobby = lobby.players[0];
                }
                mapUsernames_lobbyIndex.delete(username);
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
}

export const lobbyHandler = lobbyConnectionHandler;