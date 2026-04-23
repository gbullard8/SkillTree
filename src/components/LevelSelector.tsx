import React, { useState } from 'react';
import { useTalentTree } from '../context/TalentTreeContext';
import './LevelSelector.css';

const MIN_LEVEL = 1;
const MAX_LEVEL = 30;

const LevelSelector = () => {
  const { level, setLevel, totalPointsSpent } = useTalentTree();
  const [message, setMessage] = useState<string>('');
  const isAtMinLevel = level <= MIN_LEVEL;
  const isAtMaxLevel = level >= MAX_LEVEL;

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2500);
  };

  const increment = () => {
    if (isAtMaxLevel) return;
    setLevel(level + 1);
  };

  const decrement = () => {
    if (isAtMinLevel) return;
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
        <button className="level-btn" onClick={decrement} disabled={isAtMinLevel}>−</button>
        <div className="level-display">
          <span className="level-label">Level</span>
          <span className="level-number">{level}</span>
        </div>
        <button className="level-btn" onClick={increment} disabled={isAtMaxLevel}>+</button>
      </div>
      {message && <div className="level-message">{message}</div>}
    </div>
  );
};

export default LevelSelector;
