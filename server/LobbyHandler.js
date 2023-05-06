
import { v4 as uuid } from 'uuid';

function lobbyConnectionHandler(io,socket,lobbies,mapUsernames_lobbyIndex) {

    function create(username, cb){
        const lobby ={
            id : uuid(),
            players : [username]
        } 
        mapUsernames_lobbyIndex.set(username,lobbies.length)
        lobbies.push(lobby);
        socket.join(lobby.id);
        cb(lobby);
        console.log(lobbies);
    }
    function join(lobbyID, username,cb){
        const index = lobbies.findIndex((lobby)=> lobby.id === lobbyID);
        if (index >= 0){
            const lobby = lobbies[index];
            if(lobby.players.length >= 8){
                cb("FULL")
            }else{
                lobby.players.push(username);
                socket.join(lobby.id);
                io.to(lobby.id).emit("lobby-player-joined",username);
                cb("OK")
            }
        }
        else{
            cb("ERROR")
        }
    }


    function leave(lobbyID, username,cb){
        const index = lobbies.findIndex((lobby)=> lobby.id === lobbyID);
        if (index >= 0){
            const lobby = lobbies[index];
            const indexUsername = lobby.findIndex((u)=> u === username);
            lobby.splice(indexUsername,1);
            mapUsernames_lobbyIndex.delete(username);
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