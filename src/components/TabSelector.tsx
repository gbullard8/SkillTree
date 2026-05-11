import './TabSelector.css';
import { TAB_IMAGES } from '../data/tabImages';

type Props = {
  tabs: string[];
  selected: string;
  onSelect: (tab: string) => void;
  pointCounts: Record<string, number>;
};

// Renders the tree tabs with per-tree allocation counters.
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
          <img className="tab-button-icon" src={TAB_IMAGES[tab]} alt="" />
        </span>
        <span className="tab-button-label-frame">
          <span className="tab-button-label">{tab}</span>
        </span>
      </button>
    ))}
  </div>
);

export default TabSelector;
