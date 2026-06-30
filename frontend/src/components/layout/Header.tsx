import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Search,
  User,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import type { RootState, AppDispatch } from '@/store';
import { logoutUser } from '@/store/authSlice';
import { openLoginModal, openSignupModal } from '@/store/uiSlice';

interface NavItem {
  label: string;
  to: string;
}

export function Header() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleLang = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
  };

  const navLinks: NavItem[] = [
    { label: t('header.nav.home', 'Home'), to: '/' },
    { label: t('header.nav.about', 'About Us'), to: '/about' },
    { label: t('common.exams', 'Exams'), to: '/exams' },
    { label: t('header.nav.courses', 'Courses'), to: '/packages' },
    { label: t('header.nav.certifications', 'Certifications'), to: '/certificates' },
    { label: t('header.nav.instructors', 'Instructors'), to: '/instructors' },
    { label: t('header.nav.blog', 'Blog'), to: '/blogs' },
    { label: t('header.nav.contact', 'Contact Us'), to: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 hover:scale-105">
              <GraduationCap size={24} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-secondary">
              {t('common.appName')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="rounded-full px-4 py-2 text-sm font-medium text-secondary transition-all duration-300 hover:bg-slate-50 hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => setSearchOpen((s) => !s)}
              aria-label={t('header.search', 'Search')}
              className="rounded-full p-2.5 text-secondary transition-colors hover:bg-slate-50 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Search size={20} />
            </button>

            {auth.authenticated ? (
              <Link
                to="/user/dashboard"
                className="rounded-full p-2.5 text-secondary transition-colors hover:bg-slate-50 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={t('common.dashboard', 'Dashboard')}
              >
                <LayoutDashboard size={20} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => dispatch(openLoginModal())}
                className="rounded-full p-2.5 text-secondary transition-colors hover:bg-slate-50 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={t('common.login', 'Login')}
              >
                <User size={20} />
              </button>
            )}

            <button
              type="button"
              onClick={toggleLang}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-secondary transition-colors hover:border-primary hover:text-primary"
            >
              {i18n.language === 'ar' ? 'EN' : 'AR'}
            </button>

            {auth.authenticated ? (
              <button
                type="button"
                onClick={() => dispatch(logoutUser())}
                className="flex items-center gap-2 rounded-full border border-red-100 px-5 py-2.5 text-sm font-bold text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut size={16} />
                {t('common.logout', 'Logout')}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => dispatch(openSignupModal())}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {t('header.enrollNow', 'Enroll Now')}
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-secondary hover:bg-slate-50 lg:hidden"
            aria-label={t('header.menu', 'Open menu')}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-100 bg-white"
          >
            <div className="mx-auto max-w-3xl px-4 py-3">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5">
                <Search size={18} className="text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder={t('header.searchPlaceholder', 'Search courses, specialties...')}
                  className="w-full bg-transparent text-sm text-secondary outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-slate-400 hover:text-secondary"
                  aria-label={t('common.cancel', 'Cancel')}
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: i18n.language === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: i18n.language === 'ar' ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 end-0 z-50 w-80 max-w-full bg-white shadow-2xl"
            >
              <div className="flex h-full flex-col p-6">
                <div className="mb-8 flex items-center justify-between">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <GraduationCap size={20} />
                    </div>
                    <span className="text-lg font-bold text-secondary">{t('common.appName')}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg p-2 text-secondary hover:bg-slate-50"
                    aria-label={t('common.close', 'Close')}
                  >
                    <X size={22} />
                  </button>
                </div>

                <nav className="flex-1 space-y-2">
                  {navLinks.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-xl px-4 py-3 text-base font-medium text-secondary transition-colors hover:bg-slate-50 hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="space-y-3 border-t border-slate-100 pt-6">
                  <button
                    type="button"
                    onClick={toggleLang}
                    className="w-full rounded-xl border border-slate-200 py-3 text-sm font-bold text-secondary hover:border-primary hover:text-primary"
                  >
                    {i18n.language === 'ar' ? 'English' : 'العربية'}
                  </button>

                  {auth.authenticated ? (
                    <>
                      <Link
                        to="/user/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-3 text-sm font-bold text-white"
                      >
                        <LayoutDashboard size={18} />
                        {t('common.dashboard', 'Dashboard')}
                      </Link>
                      <button
                        type="button"
                        onClick={() => dispatch(logoutUser())}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={18} />
                        {t('common.logout', 'Logout')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => { setMobileOpen(false); dispatch(openLoginModal()); }}
                        className="w-full rounded-xl border border-slate-200 py-3 text-sm font-bold text-secondary hover:bg-slate-50"
                      >
                        {t('common.login', 'Login')}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setMobileOpen(false); dispatch(openSignupModal()); }}
                        className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white shadow hover:bg-primary/90"
                      >
                        {t('header.enrollNow', 'Enroll Now')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
