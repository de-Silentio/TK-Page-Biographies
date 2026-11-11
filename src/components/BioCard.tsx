import React, { useState } from 'react';
import { Biography } from '../data/biographies';
import { ArrowRight, User } from 'lucide-react';

interface BioCardProps {
  bio: Biography;
  onSelect: (id: string) => void;
}

export const BioCard: React.FC<BioCardProps> = ({ bio, onSelect }) => {
  const [imgError, setImgError] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSelect(bio.id);
    window.location.hash = `bio/${bio.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <article className="group bg-white border border-stone-200/90 rounded-lg overflow-hidden flex flex-col hover:border-stone-400 hover:shadow-md transition-all duration-200">
      {/* 1. Picture link that links to the person's webpage */}
      <a
        href={`#bio/${bio.id}`}
        onClick={handleClick}
        className="block relative aspect-4/3 overflow-hidden bg-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-800"
        aria-label={`View full biography for ${bio.name}`}
      >
        {!imgError ? (
          <img
            src={bio.image}
            alt={`Portrait of ${bio.name}`}
            className="w-full h-full object-cover object-top group-hover:scale-104 transition-transform duration-300"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4">
            <User className="w-12 h-12 stroke-[1.5] mb-2" />
            <span className="text-xs font-serif italic text-stone-500">Archival Portrait</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Category and Years (Zero-pill text separator) */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2 font-medium">
            <span>{bio.category}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{bio.years}</span>
          </div>

          {/* 2. Link for this person's name that links to the full bio */}
          <h2 className="font-serif text-xl font-semibold text-stone-900 group-hover:text-amber-900 transition-colors leading-snug">
            <a
              href={`#bio/${bio.id}`}
              onClick={handleClick}
              className="hover:underline focus:outline-hidden focus:ring-1 focus:ring-amber-800 rounded-xs"
            >
              {bio.name}
            </a>
          </h2>

          <p className="mt-2.5 text-stone-600 text-sm line-clamp-3 leading-relaxed">
            {bio.summary}
          </p>
        </div>

        {/* Read full bio CTA link */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[11px] text-stone-400 font-mono tracking-tight">
            Doc: {bio.docTitle}
          </span>
          <a
            href={`#bio/${bio.id}`}
            onClick={handleClick}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-900 group-hover:text-amber-900 hover:gap-2 transition-all"
          >
            <span>Read Bio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
