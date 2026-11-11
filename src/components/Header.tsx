import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { BIOGRAPHIES } from '../data/biographies';

interface HeaderProps {
  onSelectPerson: (id: string | null) => void;
  currentPersonId: string | null;
  onFilterCategory?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPerson,
  currentPersonId,
  onFilterCategory,
}) => {
  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * BIOGRAPHIES.length);
    const randomPerson = BIOGRAPHIES[randomIndex];
    onSelectPerson(randomPerson.id);
    window.location.hash = `bio/${randomPerson.id}`;
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelectPerson(null);
    window.location.hash = '';
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Zone */}
        <a
          href="#"
          onClick={handleHomeClick}
          className="group flex items-center gap-3 text-stone-900 whitespace-nowrap shrink-0"
        >
          <div className="w-9 h-9 rounded bg-stone-900 text-stone-100 flex items-center justify-center font-serif text-lg font-bold shadow-xs group-hover:bg-amber-900 transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="font-brand text-lg font-bold tracking-tight text-stone-900 block leading-tight">
              Biographical Archive
            </span>
            <span className="text-[11px] text-stone-500 tracking-wider uppercase font-medium">
              44 Historical & Cultural Profiles
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <a
            href="#"
            onClick={handleHomeClick}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              !currentPersonId ? 'text-amber-900 font-semibold' : ''
            }`}
          >
            All Biographies
          </a>
          <button
            onClick={() => {
              onSelectPerson(null);
              window.location.hash = '';
              if (onFilterCategory) onFilterCategory('Leaders & Activists');
            }}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Leaders
          </button>
          <button
            onClick={() => {
              onSelectPerson(null);
              window.location.hash = '';
              if (onFilterCategory) onFilterCategory('Science & Exploration');
            }}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Science
          </button>
          <button
            onClick={() => {
              onSelectPerson(null);
              window.location.hash = '';
              if (onFilterCategory) onFilterCategory('Arts & Literature');
            }}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Arts & Letters
          </button>
          <button
            onClick={() => {
              onSelectPerson(null);
              window.location.hash = '';
              if (onFilterCategory) onFilterCategory('Sports & Athletics');
            }}
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Athletics
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleRandom}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
            title="Discover a random biographical profile"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Discover Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};
