import TalentTree from './components/TalentTree';
import { TalentTreeProvider } from './context/TalentTreeContext';

const SkillTreePage = () => (
  <TalentTreeProvider>
    <TalentTree />
  </TalentTreeProvider>
);

export default SkillTreePage;
