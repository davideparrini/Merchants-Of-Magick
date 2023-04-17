import React, { useEffect, useState } from 'react'
import './Skill.css'

function Skill({gold,name,attribute1, attribute2, attribute3,typeItem}) {

    const[hasSkill, setHasSkill] = useState(false);
    const[att1,setAtt1] = useState(false);
    const[att2,setAtt2] = useState(false);
    const[att3,setAtt3] = useState(false);
    
   function checkAttribute(att, boolAtt){
        if(att === 0){
            return 'noButton';
        }
        else{
            if(!boolAtt) 
                return 'numberCircle'
            else return 'numberCircle upgraded'
        }
   }

   function checkTypeItem(){
        if('typeItem' === "CraftingItem")
            return 'ᨆ'
        else return 'ᨈ'
   }


    useEffect(()=>{
        if(att1 && att2 && att3) 
            setHasSkill(true);
    },[att1,att2,att3])

    return (
        <div className="skill">
            <button className={hasSkill ? 'numberCircle gold' : 'numberCircle grey'}>{gold}</button>
            <p className='skillName'>dddd</p>
            <button className={checkAttribute(attribute1,att1)} onClick={() => {setAtt1(true)}}>6</button>
            <button className={checkAttribute(attribute2,att2)} onClick={() => {setAtt2(true)}}>{attribute2}</button>
            <button className={checkAttribute(attribute3,att3)} onClick={() => {setAtt3(true)}}>{attribute3}</button>
        </div>
    )
}

export default Skill