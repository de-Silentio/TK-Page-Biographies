import React from 'react';
import { BookOpen } from 'lucide-react';

interface FooterProps {
  totalCount: number;
  onSelectCategory: (cat: string) => void;
  onGoHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ totalCount, onSelectCategory, onGoHome }) => {
  return (
    <footer className="no-print mt-20 border-t border-stone-200 bg-stone-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <BookOpen className="w-4 h-4 text-stone-700" />
              <span className="font-serif font-bold text-stone-900 text-sm tracking-tight">
                Historical Biographies Archive
              </span>
            </div>
            <p className="text-xs text-stone-500 max-w-md">
              A self-standing educational reference library featuring {totalCount} comprehensive biographical profiles spanning science, statecraft, arts, and athletics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-stone-600">
            <button
              onClick={onGoHome}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              All Profiles
            </button>
            <button
              onClick={() => onSelectCategory('Leaders & Activists')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Leaders
            </button>
            <button
              onClick={() => onSelectCategory('Science & Exploration')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Science
            </button>
            <button
              onClick={() => onSelectCategory('Arts & Literature')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Arts & Letters
            </button>
            <button
              onClick={() => onSelectCategory('Innovators & Builders')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Innovators
            </button>
            <button
              onClick={() => onSelectCategory('Sports & Athletics')}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Athletics
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
          <p>© {new Date().getFullYear()} Historical Biographies Archive. Educational and historical resource.</p>
          <p>44 Historical Profiles · Verified Transcriptions</p>
        </div>
      </div>
    </footer>
  );
};
