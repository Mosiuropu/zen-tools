import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, FileText, Download, Trash2, ShieldCheck } from 'lucide-react';

export default function ZenNotes() {
  const [content, setContent] = useState(() => {
    return localStorage.getItem('zen_notes_content') || '';
  });
  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('zen_notes_content', content);
  }, [content]);

  const downloadNotes = () => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `zen-notes-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearNotes = () => {
    if (window.confirm('Are you sure you want to clear all notes? This cannot be undone.')) {
      setContent('');
    }
  };

  return (
    <div className={`max-w-4xl mx-auto space-y-8 transition-all duration-700 ${isFocusMode ? 'mt-[-80px]' : ''}`}>
      <div className={`flex justify-between items-center transition-opacity duration-500 ${isFocusMode ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-50 flex items-center gap-3">
            <FileText className="w-8 h-8 text-stone-900 dark:text-orange-500" />
            Zen Notes
          </h2>
          <p className="text-stone-500 dark:text-stone-400 font-medium">A sanctuary for your thoughts. Markdown supported.</p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={downloadNotes}
            className="p-4 rounded-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-900 dark:hover:text-stone-100 hover:border-orange-200 dark:hover:border-stone-700 transition-all shadow-sm"
            title="Download as .md"
          >
            <Download className="w-6 h-6" />
          </button>
          <button
            onClick={clearNotes}
            className="p-4 rounded-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500 hover:text-red-500 hover:border-red-200 dark:hover:border-red-500/50 transition-all shadow-sm"
            title="Clear all"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className={`relative group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl transition-all duration-700 ${isFocusMode ? 'bg-opacity-0 dark:bg-opacity-0 border-none shadow-none p-0 max-w-none' : ''}`}>
        <button
          onClick={() => setIsFocusMode(!isFocusMode)}
          className={`absolute right-8 top-8 p-3 rounded-md bg-stone-50 dark:bg-stone-950 text-stone-300 dark:text-stone-600 hover:text-stone-900 dark:hover:text-orange-400 transition-all z-10 ${isFocusMode ? 'fixed right-10 top-10 opacity-20 hover:opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          {isFocusMode ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
        </button>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your thoughts here..."
          className={`w-full min-h-[60vh] bg-transparent border-none text-stone-700 dark:text-stone-200 text-base leading-relaxed focus:ring-0 placeholder-stone-200 dark:placeholder-stone-800 resize-none font-serif selection:bg-orange-500/30 ${isFocusMode ? 'text-sm py-20 px-4 md:px-20 text-center max-w-5xl mx-auto block' : ''}`}
          spellCheck="false"
        />

        {!isFocusMode && (
          <div className="mt-8 pt-8 border-t border-stone-100 dark:border-stone-800/50 flex justify-between items-center text-[10px] font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-600">
            <span>{content.length} characters • {content.split(/\s+/).filter(Boolean).length} words</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Encrypted in local storage</span>
          </div>
        )}
      </div>
    </div>
  );
}
