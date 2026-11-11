import React from 'react';
import { CATEGORIES, Category } from '../data/biographies';

interface CategoryFilterProps {
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  counts: Record<string, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  counts,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/70 border border-stone-200 rounded-lg">
      {CATEGORIES.map((cat) => {
        const isActive = selectedCategory === cat;
        const count = counts[cat] ?? 0;
        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              isActive
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/50'
            }`}
          >
            <span>{cat}</span>
            <span
              className={`text-[10px] tabular-nums px-1.5 py-0.2 rounded ${
                isActive ? 'bg-stone-100 text-stone-700' : 'text-stone-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
