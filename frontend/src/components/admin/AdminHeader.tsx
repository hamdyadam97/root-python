import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  User,
  ChevronDown,
} from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import type { RootState } from '@/store';

interface Props {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: Props) {
  const { t, i18n } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const { isDark, toggle } = useDarkMode();
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleLang = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu size={22} />
        </button>
        <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2.5 md:flex dark:border-slate-700 dark:bg-slate-800/60">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder={t('admin.actions.search')}
            className="w-56 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 lg:w-72"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          type="button"
          onClick={toggle}
          className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button
          type="button"
          onClick={toggleLang}
          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200"
        >
          {i18n.language === 'ar' ? 'EN' : 'AR'}
        </button>
        <button
          type="button"
          className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Bell size={20} />
          <span className="absolute right-2 top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">3</span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((s) => !s)}
            className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 pl-3 transition hover:border-primary/30 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="hidden text-start md:block">
              <p className="text-xs font-bold text-slate-800 dark:text-white">{user?.first_name || 'Admin'}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{t('admin.modules.users')}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User size={18} />
            </div>
            <ChevronDown size={14} className="hidden text-slate-400 md:block" />
          </button>
          {profileOpen && (
            <div className="absolute end-0 top-full mt-2 w-48 rounded-2xl border border-slate-100 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="block w-full px-4 py-3 text-start text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                {t('admin.modules.profile')}
              </button>
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                className="block w-full px-4 py-3 text-start text-sm font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                {t('admin.modules.settings')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
