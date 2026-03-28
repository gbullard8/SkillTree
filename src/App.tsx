import './App.css';
import TalentTree from './components/TalentTree';

function App() {
  return (
    <div className="App">
      <div className="content-wrapper">
        <img
          src="/talentbackground/SRLogo.png"
          alt="Stolen Realm"
          className="logo"
        />
        <TalentTree />
      </div>
    </div>
  );
}

export default App;


