import React, { useRef, useState, useEffect } from 'react';


const CustomDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option, idx) => {
    if (!(idx === 0 && option.toLowerCase().includes('selecciona'))) {
      onChange(option);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-full" ref={ref}>
      <button
        type="button"
        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm text-left focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[44px]"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="block whitespace-normal break-words">
          {value || <span className="text-gray-400">{placeholder}</span>}
        </span>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</span>
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 z-50 bg-gray-800 border border-gray-600 rounded shadow-lg max-h-60 overflow-y-auto">
          {options.map((option, idx) => (
            <button
              key={idx}
              type="button"
              className={`w-full text-left px-3 py-2 text-sm text-white hover:bg-yellow-600/30 whitespace-normal break-words ${value === option ? 'bg-yellow-700/30' : ''}`}
              onClick={() => handleSelect(option, idx)}
              disabled={idx === 0 && option.toLowerCase().includes('selecciona')}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
