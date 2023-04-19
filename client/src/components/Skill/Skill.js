import React, { useEffect, useState } from 'react'
import './Skill.css'
import steelImg from './iconsAttribute/steel.png'
import woodImg from './iconsAttribute/wood.png'
import leatherImg from './iconsAttribute/leather.png'
import elementalImg from './iconsAttribute/elemental.png'
import arcaneImg from './iconsAttribute/arcane.png'
import wildImg from './iconsAttribute/wild.png'

function Skill({skill}) {
    const[hasSkill, setHasSkill] = useState(false);
    const[att1,setAtt1] = useState(checkAttribute(skill.attribute1));
    const[att2,setAtt2] = useState(checkAttribute(skill.attribute2));
    const[att3,setAtt3] = useState(checkAttribute(skill.attribute3));
    const craftingItem = ['Accessories','Weapons','Armor']
    const magicResearch = ['Enchantments' , 'Charms']

    function checkAttribute(att){
        return (att === 0 || att == null);
    }

    function checkNoButton(att, boolAtt){
        if(att === 0 || att == null){
            return 'noButton';
        }
        else{
            if(!boolAtt) 
                return 'numberCircle'
            else return 'numberCircle upgraded'
        }
    }
    function checkNoImg(att){
        if(att === 0 || att == null){
            return 'noImg';
        }
        else return 'attributeImg';
    }

   function checkTypeItem(){
        if(craftingItem.includes(skill.typeItem))
            return 'ᨈ'
        else return 'ᨆ'
   }


    useEffect(()=>{
        if(att1 && att2 && att3) 
            setHasSkill(true);
    },[att1,att2,att3])

    return (
        <div className= {craftingItem.includes(skill.typeItem) ? 'skill crafting' : 'skill magic'}>
            <button className={hasSkill ? 'numberCircle gold' : 'numberCircle grey'}>{skill.gold}</button>
            <p className='skillName'>{skill.name}</p>
            <img src={checkTypeItem() === 'ᨈ'? steelImg : elementalImg} alt='Wood' className={checkNoImg(skill.attribute1) + ' img1'}></img>
            <button className={checkNoButton(skill.attribute1,att1) + ' btn1'} onClick={() => {setAtt1(true)}}>{skill.attribute1}
                <div className={checkTypeItem() === 'ᨈ'? 'cappuccioSu' : 'cappuccioGiu'}>{checkTypeItem()}</div>
            </button>
            <img src={checkTypeItem() === 'ᨈ'? woodImg : arcaneImg} alt='Wood' className={checkNoImg(skill.attribute2) + ' img2'}></img>
            <button className={checkNoButton(skill.attribute2,att2)+ ' btn2'} onClick={() => {setAtt2(true)}}>{skill.attribute2}
                <div className={checkTypeItem() === 'ᨈ'? 'cappuccioSu' : 'cappuccioGiu'}>{checkTypeItem()}</div>
            </button>
            <img src={checkTypeItem() === 'ᨈ'? leatherImg : wildImg} alt='Wood' className={checkNoImg(skill.attribute3) + ' img3'}></img>
            <button className={checkNoButton(skill.attribute3,att3) + ' btn3'} onClick={() => {setAtt3(true)}}>{skill.attribute3}
                <div className= {checkTypeItem() === 'ᨈ'? 'cappuccioSu' : 'cappuccioGiu'}>{checkTypeItem()}</div>
            </button>
        </div>
    )
}

export default Skill