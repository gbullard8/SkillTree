import React, { useState } from 'react';
import { useTalentTree } from '../context/TalentTreeContext';
import './LevelSelector.css';

const MIN_LEVEL = 1;
const MAX_LEVEL = 30;

const LevelSelector = () => {
  const { level, setLevel, totalPointsSpent } = useTalentTree();
  const [message, setMessage] = useState<string>('');

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2500);
  };

  const increment = () => {
    if (level >= MAX_LEVEL) {
      showMessage('Maximum level is 30.');
      return;
    }
    setLevel(level + 1);
  };

  const decrement = () => {
    if (level <= MIN_LEVEL) {
      showMessage('Minimum level is 1.');
      return;
    }
    // Can't drop below the level needed to cover allocated points
    // availablePoints = level + 2, so need (level - 1) + 2 >= totalPointsSpent
    const nextAvailable = (level - 1) + 2;
    if (nextAvailable < totalPointsSpent) {
      showMessage(`Can't go below level ${totalPointsSpent - 2} with ${totalPointsSpent} points allocated.`);
      return;
    }
    setLevel(level - 1);
  };

  return (
    <div className="level-selector-wrapper">
      <div className="level-selector">
        <button className="level-btn" onClick={decrement}>−</button>
        <div className="level-display">
          <span className="level-label">Level</span>
          <span className="level-number">{level}</span>
        </div>
        <button className="level-btn" onClick={increment}>+</button>
      </div>
      {message && <div className="level-message">{message}</div>}
    </div>
  );
};

export default LevelSelector;
