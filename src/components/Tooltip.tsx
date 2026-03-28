import React from 'react';
import { Skill } from '../models/Skill';
import './TalentTree.css';


type Props = {
  skill: Skill;
};

const SkillTooltip = ({ skill }: Props) => {
  return (
    <div>
      <h3>{(skill as any).skillName}</h3>
      <p>{(skill as any).description}</p>
      <p></p>
    </div>
  );
};

export default SkillTooltip;
