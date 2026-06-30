import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { adminMenu } from '@/config/adminEntities';

interface Props {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  onLogout: () => void;
}

export function AdminSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, onLogout }: Props) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';

  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 z-50 flex flex-col transition-all duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : isRTL ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-20' : 'w-72'} bg-slate-950 text-slate-200 shadow-2xl`}
      >
        <div className="flex h-20 items-center justify-between px-5">
          <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-teal-400 text-white shadow-lg">
              <GraduationCap size={22} />
            </div>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="whitespace-nowrap text-lg font-bold text-white"
                >
                  RootsExams
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white lg:flex"
            >
              {collapsed ? (isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />) : isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {adminMenu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.id}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? t(item.labelKey) : undefined}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                  active
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon size={20} className="shrink-0" />
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap text-sm font-medium"
                    >
                      {t(item.labelKey)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        <div className="p-3">
          <button
            type="button"
            onClick={onLogout}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-rose-400 transition hover:bg-rose-500/10 ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={20} />
            {!collapsed && <span className="whitespace-nowrap text-sm font-medium">{t('admin.actions.logout')}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
