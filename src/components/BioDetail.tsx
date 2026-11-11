import React, { useState, useEffect, useRef } from 'react';
import { Biography, getAdjacentBiographies, getPortraitUrl } from '../data/biographies';
import { parseBiographyText } from '../utils/textParser';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Printer,
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  FileText,
  BookOpen,
  Quote,
  Info,
  Maximize2,
  X
} from 'lucide-react';

interface BioDetailProps {
  bio: Biography;
  onBack: () => void;
  onSelectPerson: (id: string) => void;
}

export const BioDetail: React.FC<BioDetailProps> = ({ bio, onBack, onSelectPerson }) => {
  const [viewMode, setViewMode] = useState<'reader' | 'verbatim'>('reader');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [copied, setCopied] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Text to speech state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPausedAudio, setIsPausedAudio] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const parsed = parseBiographyText(bio.rawText);
  const { prev, next } = getAdjacentBiographies(bio.id);

  // Reset audio & state on person change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    stopAudio();
    setImgError(false);
    return () => {
      stopAudio();
    };
  }, [bio.id]);

  // Audio controls
  const startAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPausedAudio) {
      window.speechSynthesis.resume();
      setIsPausedAudio(false);
      setIsPlayingAudio(true);
      return;
    }

    window.speechSynthesis.cancel();
    // Prepare clean reading text
    const textToRead = `${bio.name}. ${bio.summary}. ${parsed.sections
      .map((s) => `${s.title}. ${s.paragraphs.join(' ')}`)
      .join(' ')}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
    setIsPausedAudio(false);
  };

  const pauseAudio = () => {
    if ('speechSynthesis' in window && isPlayingAudio) {
      window.speechSynthesis.pause();
      setIsPausedAudio(true);
      setIsPlayingAudio(false);
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(bio.rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = bio.rawText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNavigate = (targetBio: Biography) => {
    stopAudio();
    onSelectPerson(targetBio.id);
    window.location.hash = `bio/${targetBio.id}`;
  };

  const fontSizeClass = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base lg:text-lg leading-relaxed lg:leading-loose',
    lg: 'text-lg lg:text-xl leading-relaxed lg:leading-loose',
  }[fontSize];

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Top Navigation Bar */}
      <nav className="no-print sticky top-18 z-30 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Biographies</span>
          </button>

          <div className="flex items-center gap-2">
            {prev && (
              <button
                onClick={() => handleNavigate(prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-200/70 rounded transition-colors cursor-pointer"
                title={`Previous: ${prev.name}`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{prev.name}</span>
                <span className="sm:hidden">Prev</span>
              </button>
            )}
            <span className="text-stone-300">|</span>
            {next && (
              <button
                onClick={() => handleNavigate(next)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-200/70 rounded transition-colors cursor-pointer"
                title={`Next: ${next.name}`}
              >
                <span className="hidden sm:inline">{next.name}</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Profile Header Block */}
        <header className="mb-10 pb-8 border-b border-stone-200">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Portrait Picture in the Document */}
            <div className="relative group shrink-0 w-full sm:w-64 md:w-72">
              <div className="aspect-4/5 w-full bg-stone-200 rounded-lg overflow-hidden border border-stone-300 shadow-sm relative">
                {!imgError ? (
                  <img
                    src={getPortraitUrl(bio.image)}
                    alt={`Portrait of ${bio.name}`}
                    className="w-full h-full object-cover object-top"
                    onError={() => setImgError(true)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <span className="font-serif italic text-sm">Archival Portrait</span>
                  </div>
                )}
                <button
                  onClick={() => setImageModalOpen(true)}
                  className="no-print absolute bottom-2 right-2 p-1.5 bg-stone-900/70 hover:bg-stone-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Expand portrait"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-2 text-[11px] text-stone-500 font-sans tracking-wide uppercase text-center">
                Archival Document Portrait · {bio.name}
              </p>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-2.5">
                <span>{bio.category}</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>Lifespan: {bio.years}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
                {bio.name}
              </h1>

              {parsed.subtitle && (
                <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed font-reading italic">
                  {parsed.subtitle}
                </p>
              )}

              {parsed.byline && (
                <div className="mt-3 text-xs text-stone-400">
                  <span>{parsed.byline}</span>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="no-print mt-6 pt-5 border-t border-stone-200 flex flex-wrap items-center gap-3">
                {/* View Mode Switcher */}
                <div className="inline-flex items-center p-1 bg-stone-200/80 rounded-md border border-stone-300/60">
                  <button
                    onClick={() => setViewMode('reader')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                      viewMode === 'reader'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Formatted Reader</span>
                  </button>
                  <button
                    onClick={() => setViewMode('verbatim')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
                      viewMode === 'verbatim'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Exact Document Text</span>
                  </button>
                </div>

                {/* Audio Listen */}
                <div className="inline-flex items-center gap-1 bg-stone-100 border border-stone-200 rounded-md px-2 py-1">
                  {!isPlayingAudio ? (
                    <button
                      onClick={startAudio}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 px-2 py-1 cursor-pointer"
                      title={isPausedAudio ? 'Resume listening' : 'Listen to biography'}
                    >
                      <Play className="w-3.5 h-3.5 text-amber-800" />
                      <span>{isPausedAudio ? 'Resume' : 'Listen'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={pauseAudio}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 px-2 py-1 cursor-pointer"
                      title="Pause reading"
                    >
                      <Pause className="w-3.5 h-3.5 text-amber-800" />
                      <span>Pause</span>
                    </button>
                  )}
                  {(isPlayingAudio || isPausedAudio) && (
                    <button
                      onClick={stopAudio}
                      className="p-1 text-stone-500 hover:text-stone-800 cursor-pointer"
                      title="Stop audio"
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Font Size Adjuster */}
                {viewMode === 'reader' && (
                  <div className="inline-flex items-center gap-1 bg-stone-100 border border-stone-200 rounded-md px-1 py-1 text-xs text-stone-600">
                    <button
                      onClick={() => setFontSize('sm')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        fontSize === 'sm' ? 'bg-white font-bold text-stone-900' : 'hover:text-stone-900'
                      }`}
                      title="Smaller font"
                    >
                      A-
                    </button>
                    <button
                      onClick={() => setFontSize('base')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        fontSize === 'base' ? 'bg-white font-bold text-stone-900' : 'hover:text-stone-900'
                      }`}
                      title="Standard font"
                    >
                      A
                    </button>
                    <button
                      onClick={() => setFontSize('lg')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        fontSize === 'lg' ? 'bg-white font-bold text-stone-900' : 'hover:text-stone-900'
                      }`}
                      title="Larger font"
                    >
                      A+
                    </button>
                  </div>
                )}

                {/* Copy Text */}
                <button
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-md transition-colors cursor-pointer"
                  title="Copy full verbatim text"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Document Text</span>
                    </>
                  )}
                </button>

                {/* Print button */}
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-md transition-colors cursor-pointer"
                  title="Print biography"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print / PDF</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* View Mode: Verbatim Exact Text */}
        {viewMode === 'verbatim' && (
          <div className="bg-white border border-stone-200 rounded-lg p-6 sm:p-8 shadow-xs mb-12">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Verbatim Document Content
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Exact transcription from {bio.docTitle}
                </p>
              </div>
              <button
                onClick={handleCopyText}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded border border-stone-300 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy All'}</span>
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm text-stone-800 leading-relaxed overflow-x-auto bg-stone-50 p-4 rounded border border-stone-200 select-text">
              {bio.rawText}
            </pre>
          </div>
        )}

        {/* View Mode: Reader View */}
        {viewMode === 'reader' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Narrative Column */}
            <article className="lg:col-span-8 font-reading text-stone-800">
              {parsed.sections.map((section, sIdx) => (
                <section key={sIdx} className="mb-10">
                  {section.title && section.title !== 'Biography Overview' && (
                    <h2 className="font-serif text-2xl font-bold text-stone-900 pb-2 mb-4 border-b border-stone-200">
                      {section.title}
                    </h2>
                  )}

                  <div className="space-y-4">
                    {section.paragraphs.map((p, pIdx) => {
                      // Apply elegant drop cap to the very first paragraph of the biography
                      const isFirst = sIdx === 0 && pIdx === 0;
                      return (
                        <p
                          key={pIdx}
                          className={`${fontSizeClass} ${
                            isFirst
                              ? 'first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-stone-900'
                              : ''
                          }`}
                        >
                          {p}
                        </p>
                      );
                    })}
                  </div>
                </section>
              ))}

              {/* Exact Document Copy Note */}
              <div className="mt-12 p-4 bg-stone-100 rounded-lg border border-stone-200 text-xs text-stone-600 flex items-start gap-3">
                <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-stone-800">Archival Document Integrity Note</p>
                  <p className="mt-0.5">
                    This biography represents the complete text exactly as authored in the source document titled{' '}
                    <span className="font-mono font-medium">"{bio.docTitle}"</span>. You can toggle to the{' '}
                    <button
                      onClick={() => setViewMode('verbatim')}
                      className="text-amber-900 underline font-medium hover:text-amber-950 cursor-pointer"
                    >
                      Exact Document Text view
                    </button>{' '}
                    to review the unformatted transcription.
                  </p>
                </div>
              </div>
            </article>

            {/* Sidebar Column: Quick Facts & Quotes */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Quick Facts Card */}
              {parsed.quickFacts.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
                  <div className="flex items-center gap-2 pb-3 mb-4 border-b border-stone-200">
                    <Info className="w-4 h-4 text-amber-800" />
                    <h3 className="font-serif font-bold text-stone-900 text-base">Quick Facts</h3>
                  </div>
                  <dl className="space-y-2.5 text-xs">
                    {parsed.quickFacts.map((fact, idx) => (
                      <div key={idx} className="pb-2 border-b border-stone-100 last:border-b-0">
                        <dt className="text-stone-400 font-sans tracking-wider uppercase text-[10px] font-semibold">
                          {fact.label}
                        </dt>
                        <dd className="font-medium text-stone-800 mt-0.5 text-xs sm:text-sm">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Quotes Showcase */}
              {parsed.quotes.length > 0 && (
                <div className="bg-amber-50/50 border border-amber-200/60 rounded-lg p-5 shadow-xs">
                  <div className="flex items-center gap-2 pb-3 mb-3 border-b border-amber-200/60">
                    <Quote className="w-4 h-4 text-amber-800" />
                    <h3 className="font-serif font-bold text-stone-900 text-base">Notable Quotes</h3>
                  </div>
                  <div className="space-y-4">
                    {parsed.quotes.slice(0, 5).map((q, idx) => (
                      <blockquote
                        key={idx}
                        className="text-xs sm:text-sm italic font-reading text-stone-700 border-l-2 border-amber-800/40 pl-3 py-0.5"
                      >
                        "{q}"
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Card */}
              <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
                <h4 className="font-serif text-sm font-semibold text-stone-900 mb-3">
                  Continue Reading
                </h4>
                <div className="space-y-2 text-xs">
                  {prev && (
                    <button
                      onClick={() => handleNavigate(prev)}
                      className="w-full text-left p-2.5 rounded bg-stone-50 hover:bg-stone-100 border border-stone-200/80 transition-colors cursor-pointer group"
                    >
                      <span className="text-[10px] text-stone-400 block uppercase tracking-wider font-semibold">
                        Previous Profile
                      </span>
                      <span className="font-serif text-stone-900 font-semibold group-hover:text-amber-900 block truncate">
                        {prev.name}
                      </span>
                    </button>
                  )}
                  {next && (
                    <button
                      onClick={() => handleNavigate(next)}
                      className="w-full text-left p-2.5 rounded bg-stone-50 hover:bg-stone-100 border border-stone-200/80 transition-colors cursor-pointer group"
                    >
                      <span className="text-[10px] text-stone-400 block uppercase tracking-wider font-semibold">
                        Next Profile
                      </span>
                      <span className="font-serif text-stone-900 font-semibold group-hover:text-amber-900 block truncate">
                        {next.name}
                      </span>
                    </button>
                  )}
                  <button
                    onClick={onBack}
                    className="w-full text-center py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors cursor-pointer pt-3 border-t border-stone-100"
                  >
                    View All 44 Biographies
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* Portrait Lightbox Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-2xl max-h-[90vh] bg-stone-900 rounded-lg p-2 overflow-hidden shadow-2xl">
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={getPortraitUrl(bio.image)}
              alt={`Portrait of ${bio.name}`}
              className="w-full max-h-[80vh] object-contain rounded"
            />
            <div className="p-3 text-center text-stone-300 text-xs font-serif">
              Portrait: {bio.name} ({bio.years})
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
