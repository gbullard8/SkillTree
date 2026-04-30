import './TabSelector.css';
import { assetUrl } from '../utils/assetUrl';

type Props = {
  tabs: string[];
  selected: string;
  onSelect: (tab: string) => void;
  pointCounts: Record<string, number>;
};

const tabImages: Record<string, string> = {
  Fire: assetUrl('/icons/aura_of_flame.png'),
  Lightning: assetUrl('/icons/enchant_lightning.png'),
  Cold: assetUrl('/icons/mass_freeze.png'),
  Warrior: assetUrl('/icons/colossus.png'),
  Light: assetUrl('/icons/mass_cure.png'),
  Ranger: assetUrl('/icons/tabs/Ranger.PNG'),
  Shadow: assetUrl('/icons/soul_exchange.png'),
  Thief: assetUrl('/icons/poison_weapon.png'),
  Monk: assetUrl('/icons/meditation.png'),
  Nature: assetUrl('/icons/mass_entangle.png'),
  Chaos: assetUrl('/icons/perturb.png'),
};

const TabSelector = ({ tabs, selected, onSelect, pointCounts }: Props) => (
  <div className="tab-bar">
    {tabs.map((tab) => (
      <button
        key={tab}
        className={`tab-button ${tab === selected ? 'selected' : ''}`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onSelect(tab)}
        aria-label={tab}
      >
        {pointCounts[tab] > 0 && (
          <span className="tab-button-counter-frame" aria-hidden="true">
            <span className="tab-button-counter">{pointCounts[tab]}</span>
          </span>
        )}
        <span className="tab-button-art" aria-hidden="true">
          <img className="tab-button-icon" src={tabImages[tab]} alt="" />
        </span>
        <span className="tab-button-label-frame">
          <span className="tab-button-label">{tab}</span>
        </span>
      </button>
    ))}
  </div>
);

export default TabSelector;
