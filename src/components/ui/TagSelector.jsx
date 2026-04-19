import React from 'react';

const TagSelector = ({ 
  tags = [], 
  selectedTags = [], 
  onChange, 
  label 
}) => {
  const toggleTag = (tag) => {
    const isSelected = selectedTags.includes(tag);
    if (isSelected) {
      onChange(selectedTags.filter((t) => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-slate-text">
          {label}
        </span>
      )}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 text-sm rounded-tag transition-all duration-200 ${
                isSelected 
                  ? 'bg-binance-yellow text-ink font-medium' 
                  : 'bg-snow text-slate-text hover:bg-border-light'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TagSelector;
