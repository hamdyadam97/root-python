import { useTranslation } from 'react-i18next';
import { Maximize, Minimize, Moon, Sun, LogOut } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';

interface Props {
  examTitle: string;
  stageText?: string;
  timerText: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onExit: () => void;
}

export function ExamHeader({ examTitle, stageText, timerText, isFullscreen, onToggleFullscreen, onExit }: Props) {
  const { t } = useTranslation();
  const { isDark, toggle } = useDarkMode();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900 lg:px-6">
      <div className="flex items-center gap-3">
        <h1 className="truncate text-base font-extrabold text-secondary dark:text-white md:text-lg">{examTitle}</h1>
        {stageText && <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300 md:inline-block">{stageText}</span>}
      </div>

      <div className="flex items-center gap-2">
        <div className="rounded-xl bg-slate-100 px-3 py-1.5 text-sm font-bold text-secondary dark:bg-slate-800 dark:text-white">
          {timerText}
        </div>
        <button
          type="button"
          onClick={toggle}
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label={isDark ? t('examPlayer.lightMode') : t('examPlayer.darkMode')}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button
          type="button"
          onClick={onToggleFullscreen}
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label={t('examPlayer.fullscreen')}
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
        <button
          type="button"
          onClick={onExit}
          className="rounded-xl p-2 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
          aria-label={t('common.exit', 'Exit')}
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
