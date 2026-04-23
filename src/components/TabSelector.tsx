import './TabSelector.css';

type Props = {
  tabs: string[];
  selected: string;
  onSelect: (tab: string) => void;
  pointCounts: Record<string, number>;
};

const tabImages: Record<string, string> = {
  Fire: '/icons/aura_of_flame.png',
  Lightning: '/icons/enchant_lightning.png',
  Cold: '/icons/mass_freeze.png',
  Warrior: '/icons/colossus.png',
  Light: '/icons/mass_cure.png',
  Ranger: '/icons/tabs/Ranger.PNG',
  Shadow: '/icons/soul_exchange.png',
  Thief: '/icons/poison_weapon.png',
  Monk: '/icons/meditation.png',
  Nature: '/icons/mass_entangle.png',
  Chaos: '/icons/perturb.png',
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
