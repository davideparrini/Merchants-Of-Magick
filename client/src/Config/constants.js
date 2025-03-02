export const SOCKET_EVENTS = {
    // Events for the lobby
    LOBBY_UPDATE: "update-lobby",
    LOBBY_INVITE: "invite-player",
  
    // Events for the game
    GAME_START: "game-start",
    GAME_CHANGE_TURN: "game-change-turn",
    GAME_END: "game-end"
  
  };


export const DICE = {
    d6:"d6",
    d8:"d8",
    d10:"d10",
    d12:"d12"
}
  
export const ATTRIBUTE_SKILL = {
    attribute1:"attribute1",
    attribute2:"attribute2",
    attribute3:"attribute3"
}


export  const gameInitMock = {
    mock:true,
    quest1: {
        attribute: "",
        gold:0
    },
    quest2: {
        attribute: "",
        gold:0
    },
    dices : {
        d6:0,
        d8:0,
        d10:0,
        d12:0
    },
    
    player:  {
      adventurer :  {
        adventurer: "",
        typeOrder: "",
        order1: "",
        order2: "",
        order3: "",
        gold: 0
        },
        username: "",  
        card1: {
            item: "",
            gold: 0,
            enchantment: "",
            origin: "",
            inProgress: true,
        },
        card2: {
            item: "",
            gold: 0,
            enchantment: "",
            origin: "",
            inProgress: true,
        },
        card3: {
            item: "",
            gold: 0,
            enchantment: "",
            origin: "",
            inProgress: true,
        }
    },
    otherPlayers : [{
      adventurer :  {
        adventurer: "",
        typeOrder: "",
        order1: "",
        order2: "",
        order3: "",
        gold: 0
        },
        username: "",  
        card1: {
            item: "",
            gold: 0,
            enchantment: "",
            origin: "",
            inProgress: true,
        },
        card2: {
            item: "",
            gold: 0,
            enchantment: "",
            origin: "",
            inProgress: true,
        },
        card3: {
            item: "",
            gold: 0,
            enchantment: "",
            origin: "",
            inProgress: true,
        }
    }],
    config : {
      nTurn : 10,
      nPotion : 5,
      reportTime : 3,
      countdown : 300,
      dicePerTurn : 2
  }
}

export const ERRORS = {
    LOBBY_NOT_FOUND: "Lobby not found",
    GAME_NOT_IN_LOBBY: "Game not in lobby",
    GAME_NOT_STARTED: "Game not started",
    GAME_NOT_OVER: "Game not over",
    GAME_OVER: "Game over",
    PLAYER_ALREADY_IN_LOBBY: "Player is in a lobby",
    LOBBY_FULL: "Lobby is full",
    PLAYER_NOT_FOUND: "Player not found in lobby",
    PLAYER_KICKED: "Player was kicked in lobby",
    NOT_LOBBY_LEADER: "Only the leader can kick players"
} ;

  export const BASE_URL_SERVER = "http://localhost:8888"; 