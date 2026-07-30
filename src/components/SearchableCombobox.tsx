import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Check, ChevronDown } from 'lucide-react';

interface SearchableComboboxProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
  allowAddNew?: boolean;
  onAddNew?: (newVal: string) => void;
  disabled?: boolean;
}

export const SearchableCombobox: React.FC<SearchableComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = 'নির্বাচন করুন...',
  label,
  allowAddNew = true,
  onAddNew,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAddingNew(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (opt: string) => {
    onChange(opt);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleAddCustom = () => {
    if (!customInput.trim()) return;
    const val = customInput.trim();
    if (onAddNew) {
      onAddNew(val);
    }
    onChange(val);
    setCustomInput('');
    setIsAddingNew(false);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm bg-white border rounded-xl shadow-xs transition-all ${
          disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200' : 'border-slate-300 hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20'
        }`}
      >
        <span className={`truncate ${value ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
          {value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-64 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Search bar */}
          <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="খুঁজুন..."
              className="w-full text-xs bg-transparent border-none outline-none text-slate-800 placeholder-slate-400"
              autoFocus
            />
          </div>

          {/* Option list */}
          <div className="overflow-y-auto flex-1 p-1 divide-y divide-slate-50">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                    value === opt ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {value === opt && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              ))
            ) : (
              <div className="px-3 py-2.5 text-xs text-slate-400 text-center">
                কোনো মিল পাওয়া যায়নি
              </div>
            )}
          </div>

          {/* Add custom option footer */}
          {allowAddNew && (
            <div className="p-2 border-t border-slate-100 bg-slate-50">
              {isAddingNew ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={customInput}
                    onChange={e => setCustomInput(e.target.value)}
                    placeholder="নতুন নাম লিখুন..."
                    className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-emerald-400 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustom())}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustom}
                    className="px-2.5 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    যোগ
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingNew(true)}
                  className="w-full py-1.5 px-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100/60 rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  নতুন অপশন যুক্ত করুন (+ Add New)
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
