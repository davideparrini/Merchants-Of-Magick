import React, { useContext } from 'react'
import './Winner.scss'
import { AppContext } from '../App'
import ItemShop from '../components/Shop/ItemShop';
import Gold from '../components/Gold/Gold';

const item = {
    item: 'warhammer',
    enchantment: 'fiery',
    origin: 'of the elvis',
    gold: 6
}

const finalReport = {
    shop: [item,item,item,item,item,item,item,item,item,item,item,item,item,item,item,item,item,item,item,item,item],
    quest1: true,
    quest2: false,
    order: true,
    renownedAccessories: true,
    weaponPrestige: false,
    eliteArmor: false,
    gold: 100
}

const player1 = {
    username:'Distraaaaa',
    report: finalReport,
    position: 1
}
const player2 = {
    username:'Gioeee',
    report: finalReport,
    position: 2
}
const player3 = {
    username:'Brix',
    report: finalReport,
    position: 2
}
const player4 = {
    username:'Alfonso',
    report: finalReport,
    position: 3
}

const gameEndState = [player1,player2, player3,player3]
const TYPE_GOLD_MEDIUM = 'MEDIUM';
const TYPE_GOLD_BIG = 'BIG';

function Winner() {

    const { gameEndState,refreshGame, navigate, LOGGED_PAGE} = useContext(AppContext);

    return (
        <div className='Winner'>
            <div className='raggi-winner'/>
            <div className='big-container-end-game'>
                <div className='container-end-game'>
                    <div className='title-winner'>RANKING</div>
                    {   
                        gameEndState.map((r,i)=>{
                            return (
                                <div className={`container-player-end-game ${r.position === 1 ? 'winner-player' : ''}`} key={i}>
                                    <div className='position-player-end-game'>{r.position}°</div>
                                    <div className='username-player-end-game'>{r.username}</div>
                                    <Gold size={TYPE_GOLD_BIG} active={true} value={r.report.gold}/>
                                </div>
                            )
                        })

                    }
                    <button className='btn-end-game'onClick={()=>{
                        navigate(LOGGED_PAGE);
                        refreshGame();
                    }}>New game</button>
                    </div>
                    <div className='container-end-game-extended'>          
                    {
                        gameEndState.map((r,i)=>{
                            return (
                                <div className={`container-player-end-game-extended`} key={i}>
                                    <div className='container-header-player-end-game'>
                                        <div className='position-player-end-game'>{r.position}°</div>
                                        <div className='username-player-end-game'>{r.username}</div>
                                        <Gold size={TYPE_GOLD_MEDIUM} active={true} value={r.report.gold}/>
                                    </div>
                                    <div className='stuff-player-end-game'><div className='title-stuff-end-game'>Quest crafting : </div>{r.report.quest1 ? 'Done' : 'Not done'}</div>
                                    <div className='stuff-player-end-game'><div className='title-stuff-end-game'>Quest Magic research :</div> {r.report.quest2 ? 'Done' : 'Not done'}</div>
                                    <div className='stuff-player-end-game'><div className='title-stuff-end-game'>Adventurer Order :</div> {r.report.order ? 'Done' : 'Not done'}</div>
                                    <div className='stuff-player-end-game'><div className='title-stuff-end-game'>Renowned Accessories :</div> {r.report.renownedAccessories ? 'Has the skill' : 'No skill'}</div>
                                    <div className='stuff-player-end-game'><div className='title-stuff-end-game'>Weapon Prestige :</div> {r.report.weaponPrestige ? 'Has the skill' : 'No skill'}</div>
                                    <div className='stuff-player-end-game'><div className='title-stuff-end-game'>Elite Armor :</div> {r.report.eliteArmor ? 'Has the skill' : 'No skill'}</div>
                                    <div className='title-stuff-end-game' id='shop-end-game'>SHOP</div>
                                    <div className='container-shop-end-game'>
                                    {
                                        r.report.shop.map((item,k)=>(
                                            <ItemShop item={item} key={k}/>
                                        ))    
                                    }
                                    </div>
                                </div>
                            )
                        })

                    }
                </div>  
            </div>
        </div>
    )
}

export default Winner