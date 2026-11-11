import React from 'react';
import { Biography, getPortraitUrl } from '../data/biographies';
import { ArrowRight, User } from 'lucide-react';

interface TableViewProps {
  biographies: Biography[];
  onSelectPerson: (id: string) => void;
}

export const TableView: React.FC<TableViewProps> = ({ biographies, onSelectPerson }) => {
  const handleRowClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    onSelectPerson(id);
    window.location.hash = `bio/${id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-stone-700">
          <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-sans tracking-wider uppercase text-stone-500 font-semibold">
            <tr>
              <th scope="col" className="py-3 px-4 w-16">Portrait</th>
              <th scope="col" className="py-3 px-4">Subject</th>
              <th scope="col" className="py-3 px-4 hidden sm:table-cell">Era / Lifespan</th>
              <th scope="col" className="py-3 px-4 hidden md:table-cell">Discipline</th>
              <th scope="col" className="py-3 px-4 hidden lg:table-cell">Document Title</th>
              <th scope="col" className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {biographies.map((bio) => (
              <tr
                key={bio.id}
                className="hover:bg-stone-50/80 transition-colors group cursor-pointer"
                onClick={(e) => handleRowClick(bio.id, e)}
              >
                {/* 1. Picture link */}
                <td className="py-2.5 px-4">
                  <a
                    href={`#bio/${bio.id}`}
                    onClick={(e) => handleRowClick(bio.id, e)}
                    className="block w-11 h-14 bg-stone-100 rounded overflow-hidden border border-stone-200 shrink-0"
                    aria-label={`View biography of ${bio.name}`}
                  >
                    <img
                      src={getPortraitUrl(bio.image)}
                      alt={bio.name}
                      className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform"
                      loading="lazy"
                    />
                  </a>
                </td>

                {/* 2. Link for this person's name */}
                <td className="py-2.5 px-4 font-medium">
                  <a
                    href={`#bio/${bio.id}`}
                    onClick={(e) => handleRowClick(bio.id, e)}
                    className="font-serif text-base text-stone-900 group-hover:text-amber-900 hover:underline block leading-snug"
                  >
                    {bio.name}
                  </a>
                  <p className="text-xs text-stone-500 line-clamp-1 mt-0.5 max-w-md hidden sm:block">
                    {bio.summary}
                  </p>
                </td>

                <td className="py-2.5 px-4 text-xs text-stone-500 hidden sm:table-cell tabular-nums font-mono">
                  {bio.years}
                </td>

                <td className="py-2.5 px-4 text-xs text-stone-600 hidden md:table-cell">
                  {bio.category}
                </td>

                <td className="py-2.5 px-4 text-xs text-stone-400 font-mono hidden lg:table-cell truncate max-w-xs">
                  {bio.docTitle}
                </td>

                <td className="py-2.5 px-4 text-right">
                  <a
                    href={`#bio/${bio.id}`}
                    onClick={(e) => handleRowClick(bio.id, e)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-stone-900 group-hover:text-amber-900"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
