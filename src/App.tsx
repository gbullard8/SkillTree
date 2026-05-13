import './App.css';
import SkillTreePage from './features/skillTree/SkillTreePage';
import { assetUrl } from './utils/assetUrl';

function App() {
  return (
    <div className="App">
      <div className="content-wrapper">
        <div className="logo-row">
          <img
            src={assetUrl('/talentbackground/SRLogo.png')}
            alt="Stolen Realm"
            className="logo"
            draggable={false}
          />
        </div>
        <SkillTreePage />
      </div>
    </div>
  );
}

export default App;
