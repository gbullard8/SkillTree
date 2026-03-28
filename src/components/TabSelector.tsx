import './TabSelector.css';


type Props = {
  tabs: string[];
  selected: string;
  onSelect: (tab: string) => void;
};

const TabSelector = ({ tabs, selected, onSelect }: Props) => (
  <div className="tab-bar">
    {tabs.map((tab) => (
      <button
        key={tab}
        className={`tab-button ${tab === selected ? 'selected' : ''}`}
        onClick={() => onSelect(tab)}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default TabSelector;