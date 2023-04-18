
import './App.css';
import CreateLobby from './components/LobbyComponents/CreateLobby';
import './components/LobbyComponents/lobbyComponents.css'
import Skill from './components/Skill/Skill';
import Dice from './components/Dice';
import CardOrder from './components/Order/CardOrder';
import titleCraftingSkills from './imagine/craftingSkillTitle.png'
import titleMagicResearch from './imagine/magicResearchTitle.png'
import ButtonTurnDone from './components/ButtonTurn/ButtonTurn';
import d6img from './imagine/d6.png'
import d8img from './imagine/d8.png'
import d10img from './imagine/d10.png'
import d12img from './imagine/d12.png'

function App() {
    const d6 = 3;
    const d8 = 6;
    const d10 = 9;
    const d12 = 11;

    return (
        <div className="App">
            <div className='extraDices'>Dices</div>
            <div className='diceLabel'>DicesNum</div>
            <img src={d6img} className='diceImg d6img'></img>
            <button className='diceBtn d6'>{d6}</button>
            <img src={d8img} className='diceImg d8img'></img>
            <button className='diceBtn d8'>{d8}</button>
            <img src={d10img} className='diceImg d10img'></img>
            <button className='diceBtn d10'>{d10}</button>
            <img src={d12img} className='diceImg d12img'></img>
            <button className='diceBtn d12'>{d12}</button>
            <div className='potionLabel'>nPotions</div>
            <ButtonTurnDone></ButtonTurnDone>
            <div className='btnShop'>btnShop</div>
            <div className='card1'>card1</div>
            <div className='card2'>card2</div>
            <div className='card3'>card3</div>
            <div className='playerTable'>playerTable</div>
            <div className='quest1'>quest1</div>
            <div className='quest2'>quest2</div>
            <div className='order1'>order1</div>
            <div className='order2'>order2</div>
            <div className='order3'>order3</div>
            <div className='skillsTable'>
                <img src={titleCraftingSkills} className='titleCraftingSkills'></img>
                <Skill gold = {1} name = {'BACKPACK'} attribute1 = {0}  attribute2 = {0} attribute3 = {3} typeItem = {'Accessories'}></Skill> 
                <Skill gold = {1} name = {'SCROLL'} attribute1 = {0}  attribute2 = {3} attribute3 = {0} typeItem = {'Accessories'}></Skill> 
                <Skill gold = {2} name = {'RING'} attribute1 = {2}  attribute2 = {0} attribute3 = {6} typeItem = {'Accessories'}></Skill> 
                <Skill gold = {3} name = {'GRIMORE'} attribute1 = {5}  attribute2 = {4} attribute3 = {4} typeItem = {'Accessories'}></Skill>                
                <Skill gold = {1} name = {'STAFF'} attribute1 = {0}  attribute2 = {6} attribute3 = {0} typeItem = {'Weapons'}></Skill> 
                <Skill gold = {2} name = {'SWORD'} attribute1 = {4}  attribute2 = {0} attribute3 = {0} typeItem = {'Weapons'}></Skill> 
                <Skill gold = {3} name = {'CROSSBOW'} attribute1 = {0}  attribute2 = {9} attribute3 = {6} typeItem = {'Weapons'}></Skill> 
                <Skill gold = {4} name = {'WARHAMMER'} attribute1 = {6}  attribute2 = {5} attribute3 = {4} typeItem = {'Weapons'}></Skill> 
                <Skill gold = {1} name = {'BRACERS'} attribute1 = {0}  attribute2 = {0} attribute3 = {9} typeItem = {'Armor'}></Skill> 
                <Skill gold = {2} name = {'HELMET'} attribute1 = {5}  attribute2 = {0} attribute3 = {0} typeItem = {'Armor'}></Skill> 
                <Skill gold = {4} name = {'GREAVES'} attribute1 = {7}  attribute2 = {0} attribute3 = {5} typeItem = {'Armor'}></Skill> 
                <Skill gold = {5} name = {'PLATE ARMOR'} attribute1 = {8}  attribute2 = {2} attribute3 = {8} typeItem = {'Armor'}></Skill> 
                <img src={titleMagicResearch}  className='titleMagicResearch'></img>
                <Skill gold = {1} name = {'FIERY'} attribute1 = {6}  attribute2 = {0} attribute3 = {11} typeItem = {'Enchantments'}></Skill> 
                <Skill gold = {2} name = {'SHOCKING'} attribute1 = {2}  attribute2 = {7} attribute3 = {0} typeItem = {'Enchantments'}></Skill> 
                <Skill gold = {2} name = {'EVERLASTING'} attribute1 = {0}  attribute2 = {1} attribute3 = {9} typeItem = {'Enchantments'}></Skill> 
                <Skill gold = {3} name = {'DIVINE'} attribute1 = {9}  attribute2 = {2} attribute3 = {7} typeItem = {'Enchantments'}></Skill> 
                <Skill gold = {1} name = {'of the ELVES'} attribute1 = {0}  attribute2 = {8} attribute3 = {10} typeItem = {'Enchantments'}></Skill>
                <Skill gold = {2} name = {'of the DWARVES'} attribute1 = {8}  attribute2 = {4} attribute3 = {0} typeItem = {'Enchantments'}></Skill> 
                <Skill gold = {3} name = {'of the ORCS'} attribute1 = {7}  attribute2 = {0} attribute3 = {4} typeItem = {'Enchantments'}></Skill> 
                <Skill gold = {4} name = {'of the DRAGONS'} attribute1 = {5}  attribute2 = {6} attribute3 = {2} typeItem = {'Enchantments'}></Skill> 
                <Skill gold = {1} name = {'GLAMOR POTION SUPPLIER'} attribute1 = {4}  attribute2 = {0} attribute3 = {0} typeItem = {'Charms'}></Skill> 
                <Skill gold = {1} name = {'RENOWNED ACCESSORIES'} attribute1 = {3}  attribute2 = {5} attribute3 = {0} typeItem = {'Charms'}></Skill> 
                <Skill gold = {2} name = {'WEAPON PRESTIGE'} attribute1 = {0}  attribute2 = {3} attribute3 = {5} typeItem = {'Charms'}></Skill> 
                <Skill gold = {3} name = {'ELITE ARMOR'} attribute1 = {1}  attribute2 = {0} attribute3 = {3} typeItem = {'Charms'}></Skill>  

            </div>
          </div>
    );
}

export default App;
