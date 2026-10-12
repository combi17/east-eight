import React, { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const Dropdown = ({ label, options, value, onChange, groups }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const labelId = useId();

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  const allOptions = groups
    ? groups.flatMap((group) => [{ label: group.label, value: group.value }, ...group.items])
    : options;
  const selected = allOptions.find((option) => option.value === value);

  const select = (next) => {
    onChange(next);
    setIsOpen(false);
  };

  const renderOption = (option, className = '') => (
    <button
      type="button"
      role="option"
      aria-selected={option.value === value}
      key={option.value || 'all'}
      className={`dropdown-item-zone ${className} ${option.value === value ? 'selected-item' : ''}`}
      onClick={() => select(option.value)}
    >
      {option.icon}
      {option.label}
    </button>
  );

  return (
    <div className="filter-group">
      <span className="filter-label" id={labelId}>{label}</span>
      <div className="custom-dropdown-container" ref={containerRef}>
        <button
          type="button"
          className={`dropdown-display-area ${isOpen ? 'active' : ''}`}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={labelId}
          onClick={() => setIsOpen((open) => !open)}
        >
          {selected ? selected.label : 'Toate'}
          <ChevronDown size={16} className={`chevron-icon ${isOpen ? 'rotate-up' : ''}`} />
        </button>

        {isOpen && (
          <div className="dropdown-options-list" role="listbox" aria-labelledby={labelId}>
            {groups ? (
              <>
                {renderOption({ label: 'Toate', value: '' })}
                {groups.map((group) => (
                  <React.Fragment key={group.value}>
                    {renderOption(
                      {
                        ...group,
                        icon: (
                          <img
                            src={`https://flagcdn.com/16x12/${group.code}.png`}
                            alt=""
                            className="flag-icon-small"
                          />
                        ),
                      },
                      'dropdown-group-header',
                    )}
                    {group.items.map((item) => renderOption(item, 'dropdown-item'))}
                  </React.Fragment>
                ))}
              </>
            ) : (
              options.map((option) => renderOption(option))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
