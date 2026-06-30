import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  MessageSquare,
  Moon,
  Sun,
  PlusCircle,
  Menu,
  User,
  ChevronDown,
} from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import type { RootState } from '@/store';

interface Props {
  onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: Props) {
  const { t, i18n } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const { isDark, toggle } = useDarkMode();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const toggleLang = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
  };

  const fullName = `${String(user?.first_name || '')} ${String(user?.last_name || '')}`.trim() || t('common.user', 'Student');

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl transition-colors dark:border-slate-700/60 dark:bg-slate-900/80">
      <div className="flex h-20 items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl p-2 text-secondary transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
            aria-label={t('header.menu')}
          >
            <Menu size={22} />
          </button>

          <div
            className={`hidden items-center gap-2 rounded-2xl border px-4 py-2.5 transition-all md:flex ${
              searchFocused
                ? 'border-primary/40 bg-white shadow-md dark:border-primary/40 dark:bg-slate-800'
                : 'border-slate-200 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-800/60'
            }`}
          >
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder={t('dashboard.header.searchPlaceholder')}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-56 bg-transparent text-sm text-secondary outline-none placeholder:text-slate-400 dark:text-slate-100 lg:w-72"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            to="/user/exam/create"
            className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-teal-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition hover:shadow-lg md:inline-flex"
          >
            <PlusCircle size={18} />
            {t('dashboard.createExam')}
          </Link>

          <button
            type="button"
            onClick={toggle}
            className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={isDark ? t('dashboard.header.lightMode') : t('dashboard.header.darkMode')}
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <Sun size={20} />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <Moon size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <button
            type="button"
            onClick={toggleLang}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-secondary transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200"
          >
            {i18n.language === 'ar' ? 'EN' : 'AR'}
          </button>

          <button
            type="button"
            className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={t('dashboard.header.messages')}
          >
            <MessageSquare size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          <button
            type="button"
            className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={t('dashboard.header.notifications')}
          >
            <Bell size={20} />
            <span className="absolute right-2 top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
              3
            </span>
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((s) => !s)}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 pl-3 transition hover:border-primary/30 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="hidden text-start md:block">
                <p className="text-xs font-bold text-secondary dark:text-slate-100">{fullName}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{t('common.student', 'Student')}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-teal-400/20 text-primary">
                {user?.image ? (
                  <img src={user.image} alt={fullName} className="h-9 w-9 rounded-xl object-cover" />
                ) : (
                  <User size={18} />
                )}
              </div>
              <ChevronDown size={14} className="hidden text-slate-400 md:block" />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute end-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
                >
                  <Link
                    to="/user/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-secondary hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-700"
                  >
                    {t('dashboard.sidebar.profile')}
                  </Link>
                  <Link
                    to="/user/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-secondary hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-700"
                  >
                    {t('dashboard.sidebar.settings')}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
