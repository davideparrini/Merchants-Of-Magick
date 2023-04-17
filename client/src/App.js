
import './App.css';
import CreateLobby from './components/LobbyComponents/CreateLobby';
import './components/LobbyComponents/lobbyComponents.css'
import Skill from './components/Skill/Skill';
import Dice from './components/Dice';
import CardOrder from './components/Order/CardOrder';

function App() {
    return (
        <div className="App">
            <CreateLobby></CreateLobby> 
            <Skill></Skill> 

        </div>
    );
}

export default App;
