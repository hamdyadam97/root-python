import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import JO from 'country-flag-icons/react/3x2/JO';
import AE from 'country-flag-icons/react/3x2/AE';
import SA from 'country-flag-icons/react/3x2/SA';
import KW from 'country-flag-icons/react/3x2/KW';
import QA from 'country-flag-icons/react/3x2/QA';
import BH from 'country-flag-icons/react/3x2/BH';
import OM from 'country-flag-icons/react/3x2/OM';
import IQ from 'country-flag-icons/react/3x2/IQ';
import EG from 'country-flag-icons/react/3x2/EG';
import LB from 'country-flag-icons/react/3x2/LB';
import SY from 'country-flag-icons/react/3x2/SY';
import PS from 'country-flag-icons/react/3x2/PS';
import LY from 'country-flag-icons/react/3x2/LY';
import TN from 'country-flag-icons/react/3x2/TN';
import DZ from 'country-flag-icons/react/3x2/DZ';
import MA from 'country-flag-icons/react/3x2/MA';
import SD from 'country-flag-icons/react/3x2/SD';
import YE from 'country-flag-icons/react/3x2/YE';
import TR from 'country-flag-icons/react/3x2/TR';
import US from 'country-flag-icons/react/3x2/US';
import GB from 'country-flag-icons/react/3x2/GB';

const COUNTRIES: { code: string; name: string; dial: string }[] = [
  { code: 'JO', name: 'Jordan', dial: '+962' },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971' },
  { code: 'SA', name: 'Saudi Arabia', dial: '+966' },
  { code: 'KW', name: 'Kuwait', dial: '+965' },
  { code: 'QA', name: 'Qatar', dial: '+974' },
  { code: 'BH', name: 'Bahrain', dial: '+973' },
  { code: 'OM', name: 'Oman', dial: '+968' },
  { code: 'IQ', name: 'Iraq', dial: '+964' },
  { code: 'EG', name: 'Egypt', dial: '+20' },
  { code: 'LB', name: 'Lebanon', dial: '+961' },
  { code: 'SY', name: 'Syria', dial: '+963' },
  { code: 'PS', name: 'Palestine', dial: '+970' },
  { code: 'LY', name: 'Libya', dial: '+218' },
  { code: 'TN', name: 'Tunisia', dial: '+216' },
  { code: 'DZ', name: 'Algeria', dial: '+213' },
  { code: 'MA', name: 'Morocco', dial: '+212' },
  { code: 'SD', name: 'Sudan', dial: '+249' },
  { code: 'YE', name: 'Yemen', dial: '+967' },
  { code: 'TR', name: 'Turkey', dial: '+90' },
  { code: 'US', name: 'United States', dial: '+1' },
  { code: 'GB', name: 'United Kingdom', dial: '+44' },
];

const FLAG_COMPONENTS: Record<string, React.FC<{ className?: string; title?: string }>> = {
  JO, AE, SA, KW, QA, BH, OM, IQ, EG, LB, SY, PS, LY, TN, DZ, MA, SD, YE, TR, US, GB,
};

function CountryFlag({ code, className }: { code: string; className?: string }) {
  const Flag = FLAG_COMPONENTS[code] || JO;
  return <Flag className={className} title={code} />;
}

interface CountryCodeSelectProps {
  value: string;
  onChange: (dialCode: string, countryCode: string) => void;
  className?: string;
}

export function CountryCodeSelect({ value, onChange, className }: CountryCodeSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = COUNTRIES.find((c) => c.dial === value) || COUNTRIES[0];

  const filtered = useMemo(() => {
    if (!search.trim()) return COUNTRIES;
    const q = search.toLowerCase();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q),
    );
  }, [search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className || ''}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 items-center gap-1.5 rounded-lg border bg-white px-2.5 text-sm font-medium hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700"
      >
        <CountryFlag code={selected.code} className="h-auto w-5 rounded-sm" />
        <span className="text-slate-700 dark:text-slate-300">{selected.dial}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>

      {open && (
        <div className="absolute top-full z-50 mt-1 w-64 overflow-hidden rounded-xl border bg-white shadow-xl dark:bg-slate-900">
          <div className="border-b p-2 dark:border-slate-700">
            <div className="relative">
              <Search size={14} className="absolute start-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                className="h-8 w-full rounded-lg border bg-slate-50 px-8 text-xs outline-none focus:border-primary dark:bg-slate-800"
              />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto overscroll-contain">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-slate-400">No results</div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onChange(c.dial, c.code);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    c.dial === value ? 'bg-primary/10 text-primary' : ''
                  }`}
                >
                  <CountryFlag code={c.code} className="h-auto w-5 rounded-sm" />
                  <span className="flex-1 text-start text-slate-700 dark:text-slate-300 truncate">{c.name}</span>
                  <span className="font-mono text-xs text-slate-400">{c.dial}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
