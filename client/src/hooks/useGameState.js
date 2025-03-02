import { useState } from "react";

export const useGameState = (config, skillsTreeInit) => {
  const [nTurn, setNTurn] = useState(1);
  const [currentGold, setCurrentGold] = useState(0);
  const [nPotion, setNPotion] = useState(config.nPotion);
  const [shop, setShop] = useState([]);
  const [skillsTree, setSkillsTree] = useState(skillsTreeInit);
  const [skillsGained, setSkillsGained] = useState([]);
  const [freeUpgrade, setFreeUpgrade] = useState(0);
  const [adventurerQuestDone, setAdventurerQuestDone] = useState(false);
  const [nAttributeGained_QuestCrafting, setnAttributeGained_QuestCrafting] = useState(0);
  const [nAttributeGained_QuestMagicResearch, setnAttributeGained_QuestMagicResearch] = useState(0);
  const [quest1Done, setQuest1Done] = useState(false);
  const [quest2Done, setQuest2Done] = useState(false);
  
  const [extraDiceUsed, setExtraDiceUsed] = useState({
    ed1: false,
    ed2: false,
    ed3: false,
    ed4: false,
    ed5: false,
    ed6: false,
  });

  const getSetExtraDiceUsed = (type) => {
    return (value) => {
      setExtraDiceUsed((prev) => ({
        ...prev,
        [type]: value, 
      }));
    };
  };
  
  function getSkillAttributeSetter(id) {
    return (attributeName, value) => {
        setSkillsTree(prevSkillsTree => {
            if (!prevSkillsTree.has(id)) return prevSkillsTree;

            const updatedSkillsTree = new Map(prevSkillsTree);
            const skill = updatedSkillsTree.get(id);
            updatedSkillsTree.set(id, { ...skill, [attributeName]: value });

            return updatedSkillsTree;
        });
    };
}


  const getSkillById = (id) => {
    return skillsTree.get(id) || null; // Restituisce null se l'ID non esiste
  };

  const setGameState = (newState) => {
    if (newState.nTurn !== undefined) setNTurn(newState.nTurn);
    if (newState.currentGold !== undefined) setCurrentGold(newState.currentGold);
    if (newState.nPotion !== undefined) setNPotion(newState.nPotion);
    if (newState.shop !== undefined) setShop(newState.shop);
    if (newState.skillsTree !== undefined) setSkillsTree(newState.nTurn === 1 ? skillsTreeInit : newState.skillsTree);
    if (newState.skillsGained !== undefined) setSkillsGained(newState.skillsGained);
    if (newState.freeUpgrade !== undefined) setFreeUpgrade(newState.freeUpgrade);
    if (newState.adventurerQuestDone !== undefined) setAdventurerQuestDone(newState.adventurerQuestDone);
    if (newState.nAttributeGained_QuestCrafting !== undefined) setnAttributeGained_QuestCrafting(newState.nAttributeGained_QuestCrafting);
    if (newState.nAttributeGained_QuestMagicResearch !== undefined) setnAttributeGained_QuestMagicResearch(newState.nAttributeGained_QuestMagicResearch);
    if (newState.quest1Done !== undefined) setQuest1Done(newState.quest1Done);
    if (newState.quest2Done !== undefined) setQuest2Done(newState.quest2Done);
    if (newState.extraDiceUsed !== undefined) setExtraDiceUsed(newState.extraDiceUsed);
  };


  return {
    gameCurrentState: {
      nTurn,
      setNTurn,
      currentGold,
      setCurrentGold,
      nPotion,
      setNPotion,
      shop,
      setShop,
      getSkillById,
      getSkillAttributeSetter,
      skillsGained,
      setSkillsGained,
      freeUpgrade,
      setFreeUpgrade,
      adventurerQuestDone,
      setAdventurerQuestDone,
      extraDiceUsed,
      getSetExtraDiceUsed,
      nAttributeGained_QuestCrafting,
      setnAttributeGained_QuestCrafting,
      nAttributeGained_QuestMagicResearch,
      setnAttributeGained_QuestMagicResearch,
      quest1Done,
      setQuest1Done,
      quest2Done,
      setQuest2Done,
      setGameState
    },
  };
};
