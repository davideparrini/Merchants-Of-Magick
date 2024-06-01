

const { v4: uuid } = require('uuid');

function lobbyConnectionHandler(io, socket, mapLobbyID_Lobby,mapUsername_Socket, mapUsername_lobbyID, handlePlayerLeftGame ) {

    //l'utente crea la lobby assegnando un id random, la cb permette di passare la lobby creata all'utente
    //username -> utente che ha chiesto di creare la lobby, cb -> callback
    function create(username, cb){
        const lobby = {
            id : uuid(),
            players : [username],
            leaderLobby : username,
            status: 'in-lobby'
        } 
        mapUsername_lobbyID.set(username, lobby.id);
        mapLobbyID_Lobby.set(lobby.id, lobby)
        socket.join(lobby.id);
        cb(lobby);
        console.log(username + ' create a new lobby');
    }

    //l'utente joina una lobby tramite ID e con la cb diamo un messaggio di feedback e la lobby joinata
    //lobbyID -> id della lobby da joinare ,username -> utente che ha chiesto di joinare la lobby, cb -> callback
    function join(lobbyID, username,cb){

        const lobby = mapLobbyID_Lobby.get(lobbyID);

        if (lobby == undefined || lobby.players == undefined){
            cb("ERROR",-1);
            return;
        }
            
        if(lobby.players.length >= 8){
            cb("FULL",-1);
            return;
        }


        if(lobby.status === 'in-lobby'){

            lobby.players.push(username);
            mapUsername_lobbyID.set(username,lobbyID);
            socket.join(lobbyID);
            //dico alla lobby che si è connesso un utente e gli passo l'username
            socket.broadcast.to(lobbyID).emit("lobby-player-joined",username);
            console.log(username + ' joined '+ lobby.leaderLobby +'\'s lobby');
            cb("OK",lobby);

        }else{
            cb("in-game",-1);
        }
                
    }

    //permette di invitare un utente tramite l'username, la callback da solo un messaggio di feedback
    //lobbyID -> id della lobby che deve essere invitato l'utente ,usernameInviter -> utente che invita, usernameInvited-> utente invitato, cb -> callback
    function requestInvitePlayer(lobbyID, usernameInviter ,usernameInvited, cb){
               
        const lobby = mapLobbyID_Lobby.get(lobbyID);
        const userSocket = mapUsername_Socket.get(usernameInvited);

        if(lobby == undefined || lobby.players == undefined || userSocket == undefined ){
            cb("ERROR");
            return;
        }

        if(mapUsername_lobbyID.has(usernameInvited)){
            cb("ALREADY_IN_A_LOBBY");
            return;
        }

        if(lobby.players.length >= 8){
            cb("FULL")
            return;
        }

        if(lobby.status === 'in-lobby'){
            //comunico all'utente che fa parte della lobby e gli spedisco la lobby, tramite il namespace registrato all'inizio della connessione
            // dell' utente
            io.emit("invite" + userSocket.id, lobbyID, usernameInviter);
            console.log("Inviter: " + usernameInviter + ' Invited: ' + usernameInvited)
            cb("OK")

        }else{
            cb('in-game')
        }   
       
    }

    //utente esce dalla lobby
    function leave(username,lobbyID){
        //faccio comunque una pulizia delle strutture dati per sicurezza
        handlePlayerLeftGame(username);

        if(lobbyID === null){
            return;
        }
        console.log(username + ' left the lobby ' + lobbyID);
        socket.broadcast.to(lobbyID).emit("lobby-player-left",username);
        socket.leave(lobbyID);
    }



    socket.on("create-lobby", create);
    socket.on("join-lobby", join);
    socket.on("leave-lobby", leave);
    socket.on("invite-player", requestInvitePlayer);

}

const lobbyHandler = lobbyConnectionHandler;
module.exports.lobbyHandler = lobbyHandler;
