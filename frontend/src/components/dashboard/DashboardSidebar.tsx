import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  History,
  Bookmark,
  XCircle,
  Heart,
  GraduationCap,
  BarChart3,
  Award,
  CreditCard,
  Tag,
  Bell,
  MessageCircle,
  Flag,
  Lightbulb,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  onLogout: () => void;
}

export function DashboardSidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen, onLogout }: Props) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';

  const groups = useMemo(
    () => [
      {
        title: t('dashboard.sidebar.study', 'Study'),
        items: [
          { to: '/user/dashboard', icon: LayoutDashboard, label: t('dashboard.sidebar.dashboard') },
          { to: '/user/exam/create', icon: PlusCircle, label: t('dashboard.sidebar.createExam') },
          { to: '/user/exam', icon: BookOpen, label: t('dashboard.sidebar.myExams') },
          { to: '/user/dashboard?tab=history', icon: History, label: t('dashboard.sidebar.examHistory'), comingSoon: true },
          { to: '/user/dashboard?tab=saved', icon: Bookmark, label: t('dashboard.sidebar.savedExams'), comingSoon: true },
          { to: '/user/dashboard?tab=wrong', icon: XCircle, label: t('dashboard.sidebar.wrongQuestions'), comingSoon: true },
          { to: '/user/dashboard?tab=favorite', icon: Heart, label: t('dashboard.sidebar.favoriteQuestions'), comingSoon: true },
        ],
      },
      {
        title: t('dashboard.sidebar.progress', 'Progress'),
        items: [
          { to: '/user/dashboard?tab=grades', icon: GraduationCap, label: t('dashboard.sidebar.myGrades'), comingSoon: true },
          { to: '/user/dashboard?tab=analytics', icon: BarChart3, label: t('dashboard.sidebar.performanceAnalytics') },
          { to: '/certificates', icon: Award, label: t('dashboard.sidebar.certificates') },
          { to: '/courses', icon: BookOpen, label: t('dashboard.sidebar.courses') },
        ],
      },
      {
        title: t('dashboard.sidebar.billing', 'Billing'),
        items: [
          { to: '/user/subscriptions', icon: CreditCard, label: t('dashboard.sidebar.subscription') },
          { to: '/packages', icon: Tag, label: t('dashboard.sidebar.offers') },
        ],
      },
      {
        title: t('dashboard.sidebar.account', 'Account'),
        items: [
          { to: '/user/dashboard?tab=notifications', icon: Bell, label: t('dashboard.sidebar.notifications') },
          { to: '/user/support', icon: MessageCircle, label: t('dashboard.sidebar.supportCenter') },
          { to: '/user/dashboard?tab=report', icon: Flag, label: t('dashboard.sidebar.reportQuestion') },
          { to: '/user/dashboard?tab=suggestions', icon: Lightbulb, label: t('dashboard.sidebar.suggestions') },
          { to: '/user/settings', icon: User, label: t('dashboard.sidebar.profile') },
          { to: '/user/settings', icon: Settings, label: t('dashboard.sidebar.settings') },
        ],
      },
    ],
    [t]
  );

  const isActive = (to: string) => {
    if (to.includes('?')) return location.pathname + location.search === to;
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  const handleClick = (e: React.MouseEvent, item: any) => {
    setMobileOpen(false);
    if (item.comingSoon) {
      e.preventDefault();
      toast.info(t('common.comingSoon', 'Coming soon'));
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center justify-between px-5">
        <Link to="/user/dashboard" className="flex items-center gap-3 overflow-hidden">
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
                {t('common.appName')}
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white lg:flex"
            aria-label={collapsed ? t('common.expand', 'Expand') : t('common.collapse', 'Collapse')}
          >
            {collapsed ? (isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />) : isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-white/80 hover:bg-white/10 lg:hidden"
            aria-label={t('common.close')}
          >
            <X size={22} />
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {groups.map((group) => (
          <div key={group.title}>
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-white/40"
                >
                  {group.title}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={(e) => handleClick(e, item)}
                    title={collapsed ? item.label : undefined}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-primary to-teal-500 text-white shadow-md shadow-primary/20'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <Icon size={20} className={`shrink-0 ${active ? 'text-white' : 'text-white/70 group-hover:text-white'}`} />
                    <AnimatePresence initial={false}>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap text-sm font-medium"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3">
        <button
          type="button"
          onClick={onLogout}
          className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-red-300 transition hover:bg-red-500/10 hover:text-red-200 ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap text-sm font-medium"
              >
                {t('dashboard.sidebar.logout')}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
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

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 z-50 transition-all duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : isRTL ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          collapsed ? 'w-20' : 'w-72'
        } bg-gradient-to-b from-secondary via-[#0a1f5c] to-secondary shadow-2xl lg:sticky lg:top-0 lg:h-screen`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
