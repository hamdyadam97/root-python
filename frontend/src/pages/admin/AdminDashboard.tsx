import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Users,
  UserCheck,
  HelpCircle,
  ClipboardList,
  BookOpen,
  CreditCard,
  Wallet,
  Award,
  TrendingUp,
  HeartPulse,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { useDarkMode } from '@/hooks/useDarkMode';

const revenueData = [
  { name: 'Jan', value: 4200 },
  { name: 'Feb', value: 5400 },
  { name: 'Mar', value: 4800 },
  { name: 'Apr', value: 6200 },
  { name: 'May', value: 7500 },
  { name: 'Jun', value: 8100 },
];

const usageData = [
  { name: 'Mon', questions: 1200, exams: 45 },
  { name: 'Tue', questions: 1500, exams: 60 },
  { name: 'Wed', questions: 1100, exams: 38 },
  { name: 'Thu', questions: 1800, exams: 72 },
  { name: 'Fri', questions: 1400, exams: 55 },
  { name: 'Sat', questions: 900, exams: 30 },
  { name: 'Sun', questions: 1300, exams: 48 },
];

const passData = [
  { name: 'Passed', value: 72 },
  { name: 'Failed', value: 28 },
];

const recent = [
  { label: 'New student registration', time: '2 min ago' },
  { label: 'Exam “Cardiology Mock” completed', time: '15 min ago' },
  { label: 'Order #ORD-1024 paid', time: '1 hour ago' },
  { label: 'Question #4821 updated', time: '2 hours ago' },
  { label: 'Certificate issued to Ahmed Hassan', time: '3 hours ago' },
];

export function AdminDashboard() {
  const { t } = useTranslation();
  const { isDark } = useDarkMode();
  const textColor = isDark ? '#cbd5e1' : '#475569';
  const gridColor = isDark ? '#334155' : '#e2e8f0';

  const stats = [
    { icon: Users, label: t('admin.dashboardHome.totalStudents'), value: 12480, color: 'bg-primary/10 text-primary' },
    { icon: UserCheck, label: t('admin.dashboardHome.activeStudents'), value: 8234, color: 'bg-emerald-100 text-emerald-600' },
    { icon: HelpCircle, label: t('admin.dashboardHome.totalQuestions'), value: 45230, color: 'bg-blue-100 text-blue-600' },
    { icon: ClipboardList, label: t('admin.dashboardHome.totalExams'), value: 1840, color: 'bg-purple-100 text-purple-600' },
    { icon: BookOpen, label: t('admin.dashboardHome.totalCourses'), value: 96, color: 'bg-amber-100 text-amber-600' },
    { icon: CreditCard, label: t('admin.dashboardHome.activeSubscriptions'), value: 3450, color: 'bg-rose-100 text-rose-600' },
    { icon: Wallet, label: t('admin.dashboardHome.revenue'), value: 124500, suffix: '$', color: 'bg-teal-100 text-teal-600' },
    { icon: Award, label: t('admin.dashboardHome.certificates'), value: 2180, color: 'bg-indigo-100 text-indigo-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">{t('admin.dashboard')}</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <HeartPulse size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t('admin.dashboardHome.systemHealth')}</p>
            <p className="font-bold text-emerald-600">Operational</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <AdminStatCard key={s.label} icon={s.icon} label={s.label} value={s.value} suffix={s.suffix} color={s.color} delay={i * 0.05} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t('admin.dashboardHome.performanceCharts')}</h3>
            <span className="flex items-center gap-1 text-sm font-bold text-emerald-600"><TrendingUp size={16} /> +12.5%</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06bfb0" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#06bfb0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: textColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: textColor }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', background: isDark ? '#1e293b' : '#fff', color: isDark ? '#f1f5f9' : '#1e293b' }} />
                <Area type="monotone" dataKey="value" stroke="#06bfb0" strokeWidth={3} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <h3 className="mb-4 text-lg font-bold text-slate-800 dark:text-white">{t('admin.dashboardHome.recentActivity')}</h3>
          <div className="space-y-4">
            {recent.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <h3 className="mb-4 text-lg font-bold text-slate-800 dark:text-white">{t('admin.dashboardHome.questionUsage')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: textColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: textColor }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', background: isDark ? '#1e293b' : '#fff', color: isDark ? '#f1f5f9' : '#1e293b' }} />
                <Bar dataKey="questions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="exams" fill="#06bfb0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <h3 className="mb-4 text-lg font-bold text-slate-800 dark:text-white">{t('admin.dashboardHome.passRate')}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', background: isDark ? '#1e293b' : '#fff', color: isDark ? '#f1f5f9' : '#1e293b' }} />
                <Pie data={passData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4}>
                  {passData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center text-2xl font-extrabold text-slate-800 dark:text-white">72%</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <h3 className="mb-4 text-lg font-bold text-slate-800 dark:text-white">{t('admin.dashboardHome.latestStudents')}</h3>
          <div className="space-y-3">
            {['Ahmed Hassan', 'Sara Ali', 'Mohamed Salah', 'Fatima Zahra', 'Omar Khaled'].map((name) => (
              <div key={name} className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">{name.charAt(0)}</div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{name}</span>
                </div>
                <ArrowRight size={16} className="text-slate-400" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
