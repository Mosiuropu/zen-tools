import React from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

export default function MobileMenu({ tabs, activeTab, onSelect, isDark, onToggleTheme }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleSelect = (id) => {
    onSelect(id);
    setOpen(false);
  };

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="xl:hidden flex items-center justify-center p-1.5 rounded-md text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] max-w-[85vw] z-50 bg-[var(--color-zen-bg-light)] dark:bg-[var(--color-zen-bg-dark)] border-l border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] shadow-2xl transform transition-all duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)]">
          <span className="text-sm font-semibold text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]">Navigation</span>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-md text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="p-3 overflow-y-auto max-h-[calc(100vh-140px)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all ${
                activeTab === tab.id
                  ? 'zen-card font-medium text-[var(--color-zen-text-light)] dark:text-[var(--color-zen-text-dark)]'
                  : 'text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)]'
              }`}
            >
              <span className={`${activeTab === tab.id ? 'text-[var(--color-zen-accent-primary-light)] dark:text-[var(--color-zen-accent-primary-dark)]' : ''}`}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--color-zen-border-light)] dark:border-[var(--color-zen-border-dark)] bg-[var(--color-zen-bg-light)] dark:bg-[var(--color-zen-bg-dark)]">
          <button
            onClick={() => {
              onToggleTheme();
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-[var(--color-zen-muted-light)] dark:text-[var(--color-zen-muted-dark)] hover:bg-[var(--color-zen-border-light)] dark:hover:bg-[var(--color-zen-border-dark)] transition-all"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </>
  );
}
