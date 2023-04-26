import React, { useEffect, useState } from 'react'
import './Skill.scss'
import steelImg from './iconsAttribute/steel.png'
import woodImg from './iconsAttribute/wood7.png'
import leatherImg from './iconsAttribute/leather.png'
import elementalImg from './iconsAttribute/elemental.png'
import arcaneImg from './iconsAttribute/arcane.png'
import wildImg from './iconsAttribute/wild.png'

function Skill({skill, setNPotion, fun_passSkillGained, valueTouchedDiceRef, typeTouchedDiceRef, isDiceTouched, setAllDicesNoTouched, setNDiceLeft_toUse, nDiceLeft_Used ,setNDiceLeft_Used , setDiceUsed, setExtraDiceUsed}) {
    const[hasSkill, setHasSkill] = useState(false);
    const[att1,setAtt1] = useState(isThereAttribute(skill.attribute1));
    const[att2,setAtt2] = useState(isThereAttribute(skill.attribute2));
    const[att3,setAtt3] = useState(isThereAttribute(skill.attribute3));
    const id = skill.id;
    const typeCraftingItem = ['Accessories','Weapons','Armor'];

    //Tipi dado
    const TYPE_D6 = 'd6';
    const TYPE_D8 = 'd8';
    const TYPE_D10 = 'd10';
    const TYPE_D12 = 'd12';

    //Tipi attributi

    const TYPE_STEEL = 'steel';
    const TYPE_WOOD = 'wood';
    const TYPE_LEATHER = 'leather';
    const TYPE_ELEMENTAL = 'elemental';
    const TYPE_ARCANE = 'arcane';
    const TYPE_WILD = 'wild';
    
    

    function isThereAttribute(attValue){
        return (attValue === 0 || attValue == null);
    }

    function checkNoButton(attValue, boolAtt, typeAtt){
        if(attValue === 0 || attValue == null){
            return 'noButton';
        }
        else{
            if(!boolAtt){
                if(isDiceTouched() && isAttributeUpgradable(attValue,typeAtt)){
                    return 'numberCircle upgradable'
                }
                else return 'numberCircle';
            }
                
            else {
                return 'numberCircle upgraded';
            }
        }
    }
    function checkNoImg(attValue){
        if(attValue === 0 || attValue == null){
            return 'noImg';
        }
        else return 'attributeImg';
    }

   function getCappuccio(){
        if(typeCraftingItem.includes(skill.typeItem))
            return 'ᨈ'
        else return 'ᨆ'
   }

   
   function matchTypeDice_Attribute(typeAtt,typeDice){
        switch(typeAtt){
            case TYPE_STEEL: return typeDice === TYPE_D6;
            case TYPE_WOOD: return typeDice === TYPE_D6 || typeDice === TYPE_D8;
            case TYPE_LEATHER: return typeDice === TYPE_D6 || typeDice === TYPE_D8 || typeDice === TYPE_D10;
            case TYPE_ELEMENTAL: return typeDice === TYPE_D8 || typeDice === TYPE_D10 || typeDice === TYPE_D12;
            case TYPE_ARCANE: return typeDice === TYPE_D10 || typeDice === TYPE_D12;
            case TYPE_WILD: return  typeDice === TYPE_D12;
            default: return false;
        }
   }

   function isAttributeUpgradable(attValue,typeAtt){
        if(!matchTypeDice_Attribute(typeAtt , typeTouchedDiceRef.current)) return false;
        if(typeCraftingItem.includes(skill.typeItem)){
            if(valueTouchedDiceRef.current >= attValue){
                return true;
            }
        }else{
            if(valueTouchedDiceRef.current <= attValue){
                return true
            }
        }
        return false;
   }
   
   function upgradeAttribute(attValue,typeAtt,setAtt){
        if(!matchTypeDice_Attribute(typeAtt , typeTouchedDiceRef.current)) return ;
        console.log(typeTouchedDiceRef.current + " " + valueTouchedDiceRef.current)
        if(typeCraftingItem.includes(skill.typeItem)){
            if(valueTouchedDiceRef.current >= attValue){
                setAtt(true);
                setDiceUsed(true);
                setNDiceLeft_toUse((n)=>(n-1));
                setNDiceLeft_Used((n)=>(n+1));
                if(nDiceLeft_Used >= 2){
                    setExtraDiceUsed(true);
                }
                setAllDicesNoTouched();
                typeTouchedDiceRef.current = '';
                valueTouchedDiceRef.current = null;
            }
        }else{
            if(valueTouchedDiceRef.current <= attValue){
                setAtt(true);
                setDiceUsed(true);
                setNDiceLeft_toUse((n)=>(n-1));
                setNDiceLeft_Used((n)=>(n+1));
                if(nDiceLeft_Used >= 2){
                    setExtraDiceUsed(true);
                }
                setAllDicesNoTouched();
                typeTouchedDiceRef.current = '';
                valueTouchedDiceRef.current = null;
            }
        }
   }



   //useEffect di check, se tutti gli attributi sono stati acquisiti allora ottengo la Skill
    useEffect(()=>{
        if(att1 && att2 && att3){
            setHasSkill(true);
            fun_passSkillGained(skill.name);
            setNPotion((n)=>(n+1));
        }   
    },[att1,att2,att3])

    

    return (
        <div className= {typeCraftingItem.includes(skill.typeItem) ? 'skill crafting' : 'skill magic'}>
            <button className={hasSkill ? 'numberCircle gold' : 'numberCircle grey'}>{skill.gold}</button>
            <p className='skillName'>{skill.name}</p>
            <img src={typeCraftingItem.includes(skill.typeItem) ? steelImg : elementalImg} alt='Wood' className={checkNoImg(skill.attribute1) + ' img1'}></img>
            <button className={checkNoButton(skill.attribute1,att1,(typeCraftingItem.includes(skill.typeItem) ? TYPE_STEEL : TYPE_ELEMENTAL)) + ' btn1'} onClick={()=>upgradeAttribute(skill.attribute1,(typeCraftingItem.includes(skill.typeItem) ? TYPE_STEEL : TYPE_ELEMENTAL), setAtt1)}>
                {skill.attribute1}
                <div className={getCappuccio()}>{getCappuccio()}</div>
            </button>
            <img src={typeCraftingItem.includes(skill.typeItem) ? woodImg : arcaneImg} alt='Wood' className={checkNoImg(skill.attribute2) + ' img2'}></img>
            <button className={checkNoButton(skill.attribute2,att2,(typeCraftingItem.includes(skill.typeItem) ? TYPE_WOOD : TYPE_ARCANE))+ ' btn2'} onClick={()=>upgradeAttribute(skill.attribute2,(typeCraftingItem.includes(skill.typeItem) ? TYPE_WOOD : TYPE_ARCANE), setAtt2)}>
                {skill.attribute2}
                <div className={getCappuccio()}>{getCappuccio()}</div>
            </button>
            <img src={typeCraftingItem.includes(skill.typeItem) ? leatherImg : wildImg} alt='Wood' className={checkNoImg(skill.attribute3) + ' img3'}></img>
            <button className={checkNoButton(skill.attribute3,att3,(typeCraftingItem.includes(skill.typeItem) ? TYPE_LEATHER : TYPE_WILD)) + ' btn3'} onClick={() => upgradeAttribute(skill.attribute3,(typeCraftingItem.includes(skill.typeItem) ? TYPE_LEATHER : TYPE_WILD), setAtt3)}>
                {skill.attribute3}
                <div className= {getCappuccio()}>{getCappuccio()}</div>
            </button>
        </div>
    )
}

export default Skill