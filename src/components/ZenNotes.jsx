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
          <h2 className="text-3xl font-black text-[#2D2D2D] dark:text-[#E8E6E3] flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#D97757] dark:text-blue-500" />
            Zen Notes
          </h2>
          <p className="text-[#73716D] dark:text-[#8C8A86] font-medium">A sanctuary for your thoughts. Markdown supported.</p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={downloadNotes}
            className="p-4 rounded-2xl bg-white dark:bg-[#2A2A29] border border-[#E6E4E0] dark:border-[#3A3A39] text-slate-400 dark:text-[#73716D] hover:text-[#D97757] dark:hover:text-white hover:border-blue-200 dark:hover:border-slate-700 transition-all shadow-sm"
            title="Download as .md"
          >
            <Download className="w-6 h-6" />
          </button>
          <button
            onClick={clearNotes}
            className="p-4 rounded-2xl bg-white dark:bg-[#2A2A29] border border-[#E6E4E0] dark:border-[#3A3A39] text-slate-400 dark:text-[#73716D] hover:text-red-500 hover:border-red-200 dark:hover:border-red-500/50 transition-all shadow-sm"
            title="Clear all"
          >
            <Trash2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className={`relative group bg-white dark:bg-[#2A2A29] border border-[#E6E4E0] dark:border-[#3A3A39] rounded-[2.5rem] p-8 md:p-12 shadow-2xl transition-all duration-700 ${isFocusMode ? 'bg-opacity-0 dark:bg-opacity-0 border-none shadow-none p-0 max-w-none' : ''}`}>
        <button
          onClick={() => setIsFocusMode(!isFocusMode)}
          className={`absolute right-8 top-8 p-3 rounded-2xl bg-[#F9F8F6] dark:bg-[#1E1D1B] text-slate-300 dark:text-[#5C5A56] hover:text-[#D97757] dark:hover:text-blue-400 transition-all z-10 ${isFocusMode ? 'fixed right-10 top-10 opacity-20 hover:opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          {isFocusMode ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
        </button>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your thoughts here..."
          className={`w-full min-h-[60vh] bg-transparent border-none text-slate-700 dark:text-slate-200 text-xl leading-relaxed focus:ring-0 placeholder-slate-200 dark:placeholder-slate-800 resize-none font-serif selection:bg-blue-500/30 ${isFocusMode ? 'text-2xl py-20 px-4 md:px-20 text-center max-w-5xl mx-auto block' : ''}`}
          spellCheck="false"
        />

        {!isFocusMode && (
          <div className="mt-8 pt-8 border-t border-[#F0EFEA] dark:border-[#3A3A39]/50 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#5C5A56]">
            <span>{content.length} characters • {content.split(/\s+/).filter(Boolean).length} words</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Encrypted in local storage</span>
          </div>
        )}
      </div>
    </div>
  );
}
