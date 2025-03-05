import React, { useCallback, useEffect, useRef, useState } from 'react'
import './Skill.scss'
import steelImg from './iconsAttribute/steel.png'
import woodImg from './iconsAttribute/wood7.png'
import leatherImg from './iconsAttribute/leather.png'
import elementalImg from './iconsAttribute/elemental.png'
import arcaneImg from './iconsAttribute/arcane.png'
import wildImg from './iconsAttribute/wild.png'
import Gold from '../Gold/Gold'
import { ATTRIBUTE_SKILL, DICE } from '../../../Config/constants'


const TYPE_GOLD_SMALL = 'SMALL';




//Tipi attributi

const TYPE_STEEL = 'steel';
const TYPE_WOOD = 'wood';
const TYPE_LEATHER = 'leather';
const TYPE_ELEMENTAL = 'elemental';
const TYPE_ARCANE = 'arcane';
const TYPE_WILD = 'wild';

//Tipi cratfing item
const typeCraftingItem = ['Accessories', 'Weapons', 'Armor'];


function checkNoImg(attValue) {
    if (attValue === 0 || attValue == null) {
        return 'no-img';
    }
    else return 'attribute-img';
}


function matchTypeDice_Attribute(typeAtt, typeDice) {
    switch (typeAtt) {
        case TYPE_STEEL: return typeDice === DICE.d6;
        case TYPE_WOOD: return typeDice === DICE.d6 || typeDice === DICE.d8;
        case TYPE_LEATHER: return typeDice === DICE.d6 || typeDice === DICE.d8 || typeDice === DICE.d10;
        case TYPE_ELEMENTAL: return typeDice === DICE.d8 || typeDice === DICE.d10 || typeDice === DICE.d12;
        case TYPE_ARCANE: return typeDice === DICE.d10 || typeDice === DICE.d12;
        case TYPE_WILD: return typeDice === DICE.d12;
        default: return false;
    }
}

function closureSetSkillAttribute(setter, attributeName){
    return (value) => {
        setter(attributeName, value);
    }
} 

function Skill({ 
            skill,
            skillTree,
            setSkillTree,
            setNPotion, 
            setReportSkills, 
            setSkillsGained, 
            valueTouchedDiceRef, 
            typeTouchedDiceRef, 
            isDiceTouched, 
            setAllDicesNoTouched, 
            setNDiceLeft_toUse, 
            nDiceLeft_Used, 
            setNDiceLeft_Used, 
            setDiceUsed, 
            setExtraDiceUsed, 
            setNAttrQuest1, 
            typeAttrQuest1, 
            setNAttrQuest2, 
            typeAttrQuest2, 
            freeUpgrade, 
            setFreeUpgrade, 
            setCurrentGold, 
            setGoldFromSkills,
            testActive 
        }) {

    const [hasSkill, setHasSkill] = useState(false);
    



    const helperRef = useRef();
    const btnHelperRef = useRef();
    const [helperOpen, setHelperOpen] = useState(false);


    



    const isAttributeUpgradable = useCallback((attValue, typeAtt) => {
        if (!matchTypeDice_Attribute(typeAtt, typeTouchedDiceRef.current)) return false;
        if (typeCraftingItem.includes(skill.typeItem)) {
            if (valueTouchedDiceRef.current >= attValue) {
                return true;
            }
        } else {
            if (valueTouchedDiceRef.current <= attValue) {
                return true
            }
        }
        return false;
    }, [skill.typeItem, typeTouchedDiceRef, valueTouchedDiceRef]);

    const upgradeAttribute = useCallback((attValue, typeAtt, setAtt) => {
        if (freeUpgrade) {
            setAtt(true);
            if (typeAtt === typeAttrQuest1) setNAttrQuest1((n) => (n + 1));
            if (typeAtt === typeAttrQuest2) setNAttrQuest2((n) => (n + 1));
            setFreeUpgrade((n) => (n - 1));
            return;
        }
        if (!matchTypeDice_Attribute(typeAtt, typeTouchedDiceRef.current)) return;
        if (typeCraftingItem.includes(skill.typeItem)) {
            if (valueTouchedDiceRef.current >= attValue) {
                setAtt(true);

                if (!testActive) {
                    setDiceUsed(true);
                    setNDiceLeft_toUse((n) => (n - 1));
                    setNDiceLeft_Used((n) => (n + 1));
                }


                if (typeAtt === typeAttrQuest1) setNAttrQuest1((n) => (n + 1));
                if (nDiceLeft_Used >= 2 && setExtraDiceUsed != null) {
                    setExtraDiceUsed(true);
                }
                setAllDicesNoTouched();
                typeTouchedDiceRef.current = '';
                valueTouchedDiceRef.current = null;
            }
        } else {
            if (valueTouchedDiceRef.current <= attValue) {
                setAtt(true);

                if (!testActive) {
                    setDiceUsed(true);
                    setNDiceLeft_toUse((n) => (n - 1));
                    setNDiceLeft_Used((n) => (n + 1));
                }

                if (typeAtt === typeAttrQuest2) setNAttrQuest2((n) => (n + 1));
                if (nDiceLeft_Used >= 2 && setExtraDiceUsed != null) {
                    setExtraDiceUsed(true);
                }
                setAllDicesNoTouched();
                typeTouchedDiceRef.current = '';
                valueTouchedDiceRef.current = null;
            }
        }
    }, [freeUpgrade, nDiceLeft_Used, setAllDicesNoTouched, setDiceUsed, setExtraDiceUsed, setFreeUpgrade, setNAttrQuest1, setNAttrQuest2, setNDiceLeft_Used, setNDiceLeft_toUse, setCurrentGold, skill.gold, skill.typeItem, testActive, typeAttrQuest1, typeAttrQuest2, typeTouchedDiceRef, valueTouchedDiceRef]);

    const checkNoButton = useCallback((attValue, boolAtt, typeAtt) => {
        if (attValue === 0 || attValue == null) {
            return 'no-button';
        }
        else {
            if (!boolAtt) {
                if ((isDiceTouched() && isAttributeUpgradable(attValue, typeAtt)) || freeUpgrade) {
                    return 'number-circle upgradable'
                }
                else return 'number-circle';
            }

            else {
                return 'number-circle upgraded';
            }
        }
    }, [freeUpgrade, isDiceTouched, isAttributeUpgradable]);


    const getCappuccio = useCallback(() => {
        if (typeCraftingItem.includes(skill.typeItem))
            return 'ᨈ'
        else return 'ᨆ'
    }, [skill.typeItem]);



    //useEffect per il close on click out

    useEffect(() => {
        let handlerHelper = (e) => {
            if (!helperRef.current.contains(e.target) && !btnHelperRef.current.contains(e.target)) {
                setHelperOpen(false);
            }
        };
        document.addEventListener("mousedown", handlerHelper);

        return () => {
            document.removeEventListener("mousedown", handlerHelper);
        }
    });


    //useEffect di check, se tutti gli attributi sono stati acquisiti allora ottengo la Skill
    useEffect(() => {
        if (skillTree.attribute1 && skillTree.attribute2 && skillTree.attribute3) {
            setHasSkill(true);
            setSkillsGained((l) => [...l, skill.name]);
            setReportSkills((l) => [...l, skill.name])
            setNPotion((n) => (n + 1));
            setCurrentGold((n) => (n + skill.gold));
            setGoldFromSkills((n) => (n + skill.gold));
            if(skill.name === 'glamor potion supplier'){
                setNPotion((n) => (n + 4));
            }
        }
    }, [skillTree])



    return (
        <div className={typeCraftingItem.includes(skill.typeItem) ? 'skill crafting' : 'skill magic'}>
            <button className={hasSkill ? 'number-circle gold-skill' : 'number-circle grey-skill'}>{skill.gold}</button>
            <p className='skill-name'>{skill.name}</p>
            <img src={typeCraftingItem.includes(skill.typeItem) ? steelImg : elementalImg} alt='Wood' className={checkNoImg(skill.attribute1) + ' img1'}></img>
            <button className={
                checkNoButton(skill.attribute1, 
                skillTree.attribute1, 
                (typeCraftingItem.includes(skill.typeItem) ? TYPE_STEEL : TYPE_ELEMENTAL)) + ' btn1'} onClick={() => upgradeAttribute(skill.attribute1, (typeCraftingItem.includes(skill.typeItem) ? TYPE_STEEL : TYPE_ELEMENTAL), closureSetSkillAttribute(setSkillTree, ATTRIBUTE_SKILL.attribute1))}>
                {skill.attribute1}
                <div className={getCappuccio()}>{getCappuccio()}</div>
            </button>
            <img src={typeCraftingItem.includes(skill.typeItem) ? woodImg : arcaneImg} alt='Wood' className={checkNoImg(skill.attribute2) + ' img2'}></img>
            <button className={checkNoButton(skill.attribute2, skillTree.attribute2, (typeCraftingItem.includes(skill.typeItem) ? TYPE_WOOD : TYPE_ARCANE)) + ' btn2'} onClick={() => upgradeAttribute(skill.attribute2, (typeCraftingItem.includes(skill.typeItem) ? TYPE_WOOD : TYPE_ARCANE), closureSetSkillAttribute(setSkillTree, ATTRIBUTE_SKILL.attribute2))}>
                {skill.attribute2}
                <div className={getCappuccio()}>{getCappuccio()}</div>
            </button>
            <img src={typeCraftingItem.includes(skill.typeItem) ? leatherImg : wildImg} alt='Wood' className={checkNoImg(skill.attribute3) + ' img3'}></img>
            <button className={checkNoButton(skill.attribute3, skillTree.attribute3, (typeCraftingItem.includes(skill.typeItem) ? TYPE_LEATHER : TYPE_WILD)) + ' btn3'} onClick={() => upgradeAttribute(skill.attribute3, (typeCraftingItem.includes(skill.typeItem) ? TYPE_LEATHER : TYPE_WILD), closureSetSkillAttribute(setSkillTree, ATTRIBUTE_SKILL.attribute3))}>
                {skill.attribute3}
                <div className={getCappuccio()}>{getCappuccio()}</div>
            </button>
            <button className={skill.typeItem === 'Charms' ? 'charms-helper' : 'charms-helper no-button'} onClick={() => setHelperOpen(!helperOpen)} ref={btnHelperRef}>?</button>
            <div className={helperOpen ? 'helper' : "helper no-button"} ref={helperRef}>
                <div className={skill.name !== "glamor potion supplier" ? '' : 'no-gold-helper'}><Gold size={TYPE_GOLD_SMALL} active={true} value={2} /></div>
                {skill.helperText}
            </div>
        </div>
    )
}

export default Skill