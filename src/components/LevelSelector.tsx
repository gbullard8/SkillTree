import { useTalentTree } from '../context/TalentTreeContext';
import './LevelSelector.css';

const MIN_LEVEL = 1;
const MAX_LEVEL = 30;

// Controls the character level while preserving currently allocated points.
const LevelSelector = () => {
  const { level, setLevel } = useTalentTree();

  const isAtMinLevel = level <= MIN_LEVEL;
  const isAtMaxLevel = level >= MAX_LEVEL;


  const increment = () => {
    if (isAtMaxLevel) return;
    setLevel(level + 1);
  };

  const decrement = () => {
    if (isAtMinLevel) return;
    setLevel(level - 1);
  };

  return (    
      <div className="level-selector">
        <button className="level-btn" onClick={decrement} disabled={isAtMinLevel}>−</button>
        <div className="level-display">
          <span className="level-label">Level:</span>
          <span className="level-number">{level}</span>
        </div>
        <button className="level-btn" onClick={increment} disabled={isAtMaxLevel}>+</button>
      </div>
    
  );
};

export default LevelSelector;
