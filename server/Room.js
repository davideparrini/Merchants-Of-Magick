
const MAX_N_PLAYERS = 8;

class Room{
    constructor(socket,roomId){
        this.roomId = roomId;
        this.players = [];
        this.room = [];
        
    }


    
}

joinRoom = Player => {
    if(this.players.length < MAX_N_PLAYERS){
        this.players.push(Player);
        return true;
    } 
    return false;
}