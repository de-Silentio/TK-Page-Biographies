import React, { useState, useEffect, useMemo } from 'react';
import { BIOGRAPHIES, Category, getBiographyById, getPortraitUrl } from './data/biographies';
import { Header } from './components/Header';
import { BioCard } from './components/BioCard';
import { BioDetail } from './components/BioDetail';
import { TableView } from './components/TableView';
import { CategoryFilter } from './components/CategoryFilter';
import { Footer } from './components/Footer';
import {
  Search,
  LayoutGrid,
  List,
  Sparkles,
  ArrowUpDown,
  BookOpen,
  FilterX,
  Compass,
  ArrowRight
} from 'lucide-react';

export default function App() {
  const [currentPersonId, setCurrentPersonId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<'default' | 'name-asc' | 'name-desc' | 'era'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Handle URL Hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#bio/')) {
        const id = hash.replace('#bio/', '');
        const found = getBiographyById(id);
        if (found) {
          setCurrentPersonId(id);
        } else {
          setCurrentPersonId(null);
        }
      } else {
        setCurrentPersonId(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: BIOGRAPHIES.length };
    for (const b of BIOGRAPHIES) {
      counts[b.category] = (counts[b.category] || 0) + 1;
    }
    return counts;
  }, []);

  // Filtered & sorted biographies
  const filteredBiographies = useMemo(() => {
    let result = BIOGRAPHIES.filter((b) => {
      const matchesCategory =
        selectedCategory === 'All' || b.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.rawText.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'era') {
      // Extract starting year
      const getStartYear = (y: string) => {
        const m = y.match(/(-?\d+)/);
        if (!m) return 9999;
        let yr = parseInt(m[1], 10);
        if (y.includes('BC')) yr = -yr;
        return yr;
      };
      result.sort((a, b) => getStartYear(a.years) - getStartYear(b.years));
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  // Featured Spotlight Person (deterministic per hour or stable)
  const featuredPerson = useMemo(() => {
    return BIOGRAPHIES.find((b) => b.id === 'ludwig-van-beethoven') || BIOGRAPHIES[0];
  }, []);

  const handleSelectPerson = (id: string | null) => {
    setCurrentPersonId(id);
    if (id) {
      window.location.hash = `bio/${id}`;
    } else {
      window.location.hash = '';
    }
  };

  const handleCategoryFromNav = (cat: string) => {
    setSelectedCategory(cat as Category);
    setSearchQuery('');
  };

  // If viewing a single person's full bio webpage
  if (currentPersonId) {
    const selectedBio = getBiographyById(currentPersonId);
    if (selectedBio) {
      return (
        <div className="min-h-screen flex flex-col bg-stone-50">
          <Header
            onSelectPerson={handleSelectPerson}
            currentPersonId={currentPersonId}
            onFilterCategory={handleCategoryFromNav}
          />
          <div className="flex-1">
            <BioDetail
              bio={selectedBio}
              onBack={() => handleSelectPerson(null)}
              onSelectPerson={handleSelectPerson}
            />
          </div>
          <Footer
            totalCount={BIOGRAPHIES.length}
            onSelectCategory={handleCategoryFromNav}
            onGoHome={() => handleSelectPerson(null)}
          />
        </div>
      );
    }
  }

  // Otherwise, render Directory / Collection Home
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header
        onSelectPerson={handleSelectPerson}
        currentPersonId={null}
        onFilterCategory={handleCategoryFromNav}
      />

      {/* Hero Marquee Section */}
      <section className="bg-gradient-to-b from-stone-100/80 to-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-800 mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Permanent Archival Collection</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>44 Unabridged Biographies</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
              A Gallery of Remarkable Lives
            </h1>
            <p className="mt-4 text-base sm:text-lg text-stone-600 font-reading leading-relaxed">
              Explore unabridged biographical accounts of historical architects, pioneering scientists, literary icons, transformative leaders, and world champions. Each profile features their archival portrait and verbatim document records.
            </p>
          </div>

          {/* Curatorial Featured Spotlight Ribbon */}
          {selectedCategory === 'All' && !searchQuery && (
            <div className="mt-8 bg-white border border-stone-200/90 rounded-lg p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-stone-400 transition-colors">
              <div className="flex items-start sm:items-center gap-4">
                <a
                  href={`#bio/${featuredPerson.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectPerson(featuredPerson.id);
                  }}
                  className="w-16 h-20 sm:w-20 sm:h-24 bg-stone-100 rounded overflow-hidden border border-stone-200 shrink-0 block"
                >
                  <img
                    src={getPortraitUrl(featuredPerson.image)}
                    alt={featuredPerson.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                  />
                </a>
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-800 font-medium mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Featured Spotlight</span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="text-stone-500">{featuredPerson.years}</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                    <a
                      href={`#bio/${featuredPerson.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectPerson(featuredPerson.id);
                      }}
                      className="hover:text-amber-900 hover:underline"
                    >
                      {featuredPerson.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-stone-600 line-clamp-2 max-w-2xl font-reading">
                    {featuredPerson.summary}
                  </p>
                </div>
              </div>
              <a
                href={`#bio/${featuredPerson.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelectPerson(featuredPerson.id);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
              >
                <span>Read Full Biography</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Directory & Controls Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Controls Bar: Search + Category Filter + Sort + View */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Live Search Input */}
            <div className="relative flex-1 max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, achievement, or keyword..."
                className="w-full pl-9 pr-9 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-800/40 focus:border-stone-400 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                  title="Clear search"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Utility Toggles: Sort & View Mode */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Sort Selector */}
              <div className="inline-flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-600 shadow-2xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-medium hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-stone-800 font-medium focus:outline-hidden cursor-pointer"
                >
                  <option value="default">Default Order</option>
                  <option value="name-asc">Name (A–Z)</option>
                  <option value="name-desc">Name (Z–A)</option>
                  <option value="era">Chronological (Era)</option>
                </select>
              </div>

              {/* Layout Switcher (Grid vs Table) */}
              <div className="inline-flex items-center p-1 bg-stone-200/80 rounded-lg border border-stone-300/60">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Grid View (Portrait Cards)"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                  title="Table View (Catalog Index)"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Segmented Category Filter Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              counts={categoryCounts}
            />

            {/* Results Counter */}
            <div className="text-xs text-stone-500 font-medium tabular-nums">
              Showing {filteredBiographies.length} of {BIOGRAPHIES.length} profiles
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredBiographies.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-lg p-12 text-center my-8">
            <FilterX className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-stone-900">
              No matching profiles found
            </h3>
            <p className="mt-1 text-sm text-stone-500 max-w-sm mx-auto">
              No biographies matched "{searchQuery}" in category "{selectedCategory}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 text-xs font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 rounded transition-colors cursor-pointer border border-stone-300"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View: Responsive cards with picture and name links */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBiographies.map((bio) => (
              <BioCard
                key={bio.id}
                bio={bio}
                onSelect={handleSelectPerson}
              />
            ))}
          </div>
        ) : (
          /* Table View: Scholarly index */
          <TableView
            biographies={filteredBiographies}
            onSelectPerson={handleSelectPerson}
          />
        )}
      </main>

      <Footer
        totalCount={BIOGRAPHIES.length}
        onSelectCategory={handleCategoryFromNav}
        onGoHome={() => handleSelectPerson(null)}
      />
    </div>
  );
}
