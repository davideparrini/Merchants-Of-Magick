import React from 'react'
import ItemShop from '../Shop/ItemShop';

function ReportPlayer({report}) {
    const namePlayerReport = report.name;
    const listSkills = report.skillsGained;
    const listItems = report.itemShop; 

    return (
        <div className='container-report'>
            <div className='name-player-report'>{namePlayerReport}</div>
            {
                listSkills.map((s,i)=>{
                    return <div className='skill-report' key={i}/>;
                })
            }
            {
                listItems.map((item,i)=>{
                    return <ItemShop item={item} key={i}/>;
                })
            }
        </div>
    )
}

export default ReportPlayer