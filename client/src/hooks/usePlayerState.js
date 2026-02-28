import { useState } from "react";

export function usePlayerState(initialQuest1, initialQuest2, initialAdventurer) {
  const [quest1, setQuest1] = useState(initialQuest1);
  const [quest2, setQuest2] = useState(initialQuest2);
  const [adventurer, setAdventurer] = useState(initialAdventurer);

  const updatePlayerState = (newQuest1, newQuest2, newAdventurer) =>{
    setQuest1(newQuest1);
    setQuest2(newQuest2);
    setAdventurer(newAdventurer);
  }
 
  return {
    quest1,
    quest2,
    adventurer,
    updatePlayerState
  };
}
