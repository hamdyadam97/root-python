import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Home,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Eye,
  MessageCircle,
  Link2,
  Check,
  Moon,
  Sun,
  Send,
  Mail,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  MessageSquare,
  Heart,
  Loader2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { clsx, type ClassValue } from 'clsx';

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
}

interface BlogComment {
  id: number;
  name: string;
  email?: string;
  content: string;
  created_at: string;
}

interface Blog {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  image?: string | null;
  author?: string | null;
  author_title?: string | null;
  author_image?: string | null;
  topic?: string | null;
  reading_time?: number;
  views?: number;
  tags?: string | null;
  status?: number;
  category?: Category | null;
  comments?: BlogComment[];
  created_at: string;
  updated_at?: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

function useFormatDate() {
  const { i18n } = useTranslation();
  return (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };
}

function parseTags(tags?: string | null) {
  return (tags || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0600-\u06FF-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function ShareButtons({ title, url }: { title: string; url: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const share = (href: string) => {
    window.open(href, '_blank', 'width=600,height=400');
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(t('blogPost.copied'));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Copy failed');
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const buttons = [
    { icon: FacebookIcon, label: t('blogPost.shareFacebook'), href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { icon: XIcon, label: t('blogPost.shareX'), href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { icon: LinkedInIcon, label: t('blogPost.shareLinkedin'), href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { icon: MessageCircle, label: t('blogPost.shareWhatsapp'), href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{t('blogPost.share')}</span>
      {buttons.map(({ icon: Icon, label, href }) => (
        <motion.button
          key={label}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => share(href)}
          aria-label={label}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-primary hover:text-white hover:ring-primary dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-primary dark:hover:text-white"
        >
          <Icon className="h-4 w-4" />
        </motion.button>
      ))}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={copy}
        aria-label={t('blogPost.copyLink')}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-secondary hover:text-white hover:ring-secondary dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-secondary dark:hover:text-white"
      >
        {copied ? <Check size={16} /> : <Link2 size={16} />}
      </motion.button>
    </div>
  );
}

function AuthorCard({ blog }: { blog: Blog }) {
  const { t } = useTranslation();
  const initials = blog.author
    ? blog.author
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
    : 'A';

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 sm:p-8">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">{t('blogPost.authorTitle')}</h3>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {blog.author_image ? (
          <img
            src={blog.author_image}
            alt={blog.author || ''}
            className="h-20 w-20 rounded-2xl object-cover ring-4 ring-slate-50 dark:ring-slate-800"
            loading="lazy"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-xl font-bold text-white">
            {initials}
          </div>
        )}
        <div className="flex-1">
          <p className="text-lg font-bold text-slate-900 dark:text-white">{blog.author || t('blog.anonymous', 'Anonymous')}</p>
          {blog.author_title && (
            <p className="text-sm font-medium text-primary">{blog.author_title}</p>
          )}
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {blog.author || t('blog.anonymous', 'Anonymous')} is a dedicated contributor passionate about sharing knowledge
            and practical insights with healthcare professionals and lifelong learners.
          </p>
          <div className="mt-3 flex items-center gap-3">
            <a href="#" className="text-slate-400 transition hover:text-primary" aria-label="LinkedIn">
              <LinkedInIcon className="h-[18px] w-[18px]" />
            </a>
            <a href="#" className="text-slate-400 transition hover:text-primary" aria-label="X">
              <XIcon className="h-[18px] w-[18px]" />
            </a>
            <a href="#" className="text-slate-400 transition hover:text-primary" aria-label="Facebook">
              <FacebookIcon className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function RelatedCard({ blog }: { blog: Blog }) {
  const { t } = useTranslation();
  const formatDate = useFormatDate();
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60"
    >
      <Link to={`/blogs/${blog.id}`} className="relative aspect-[16/10] overflow-hidden">
        <img
          src={blog.image || '/placeholder-blog.jpg'}
          alt={blog.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-3">
          <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-secondary backdrop-blur-sm">
            {blog.topic || blog.category?.name || 'Blog'}
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h4 className="mb-2 line-clamp-2 text-base font-bold text-slate-900 transition group-hover:text-primary dark:text-white">
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </h4>
        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {blog.subtitle || blog.description.replace(/<[^>]+>/g, '').slice(0, 120)}...
        </p>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(blog.created_at)}
          </span>
          <Link
            to={`/blogs/${blog.id}`}
            className="inline-flex items-center gap-1 font-semibold text-primary transition hover:gap-2"
          >
            {t('blog.readMore')} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function CommentItem({ comment }: { comment: BlogComment }) {
  const formatDate = useFormatDate();
  const initials = comment.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-sm font-bold text-secondary dark:text-primary">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-900 dark:text-white">{comment.name}</span>
          <span className="text-xs text-slate-500">{formatDate(comment.created_at)}</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{comment.content}</p>
      </div>
    </div>
  );
}

function PrevNextCard({
  blog,
  direction,
}: {
  blog: Blog;
  direction: 'prev' | 'next';
}) {
  const { t } = useTranslation();
  const isPrev = direction === 'prev';
  return (
    <Link
      to={`/blogs/${blog.id}`}
      className={cn(
        'group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60',
        isPrev ? 'text-start' : 'flex-row-reverse text-end'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-600 transition group-hover:bg-primary group-hover:text-white dark:bg-slate-800 dark:text-slate-300'
        )}
      >
        {isPrev ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
      </div>
      <div className="min-w-0">
        <span className="block text-xs font-medium text-slate-400">
          {isPrev ? t('blogPost.previousArticle') : t('blogPost.nextArticle')}
        </span>
        <p className="line-clamp-1 text-sm font-bold text-slate-900 transition group-hover:text-primary dark:text-white">
          {blog.title}
        </p>
      </div>
    </Link>
  );
}

function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error(t('footer.newsletter.invalid'));
      return;
    }
    toast.success(t('blogPost.newsletterSuccess'));
    setEmail('');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary to-slate-900 px-6 py-10 text-white shadow-lg sm:px-10 sm:py-12">
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
          <Mail size={28} className="text-primary" />
        </div>
        <h3 className="mb-2 text-2xl font-bold sm:text-3xl">{t('blogPost.newsletterTitle')}</h3>
        <p className="mb-6 text-slate-200">{t('blogPost.newsletterSubtitle')}</p>
        <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('blogPost.newsletterPlaceholder')}
            className="flex-1 rounded-xl border-0 bg-white/10 px-5 py-3 text-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-secondary transition hover:bg-primary/90"
          >
            {t('blogPost.newsletterButton')} <Send size={16} />
          </button>
        </form>
      </div>
      <Heart className="absolute -bottom-4 -end-4 h-40 w-40 text-white/5" />
      <Mail className="absolute -start-6 -top-6 h-40 w-40 text-white/5" />
    </div>
  );
}

function CTABanner() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden rounded-3xl bg-secondary text-white shadow-xl">
      <img
        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/70" />
      <div className="relative z-10 px-6 py-14 text-center sm:px-10 sm:py-20">
        <h2 className="mb-3 text-2xl font-bold sm:text-4xl">{t('blogPost.ctaTitle')}</h2>
        <p className="mx-auto mb-8 max-w-2xl text-slate-200">{t('blogPost.ctaSubtitle')}</p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/packages"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-secondary transition hover:bg-primary/90"
          >
            {t('blogPost.ctaButton')}
          </Link>
          <a
            href="mailto:info@rootsexams.com"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
          >
            {t('blogPost.ctaContact')}
          </a>
        </div>
      </div>
    </section>
  );
}

export function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const formatDate = useFormatDate();
  const contentRef = useRef<HTMLDivElement>(null);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/blogs/${id}`)
      .then((res) => {
        const data = res.data?.data?.blog;
        if (data) setBlog(data);
      })
      .catch(() => toast.error(t('blogPost.notFound')))
      .finally(() => setLoading(false));
  }, [id, t]);

  useEffect(() => {
    api.get('/blogs/index').then((res) => setAllBlogs(res.data?.data?.blogs || []));
  }, []);

  useEffect(() => {
    if (!blog) return;
    api
      .get(`/blogs/${blog.id}/comments`)
      .then((res) => setComments(res.data?.data?.comments || []))
      .catch(() => setComments(blog.comments || []));
  }, [blog]);

  useEffect(() => {
    if (!contentRef.current || !blog) return;
    const headings = contentRef.current.querySelectorAll('h2, h3, h4');
    const items: TocItem[] = [];
    headings.forEach((h, idx) => {
      if (!h.id) {
        h.id = slugify(h.textContent || `section-${idx}`) || `section-${idx}`;
      }
      items.push({
        id: h.id,
        text: h.textContent || '',
        level: parseInt(h.tagName[1], 10),
      });
    });
    setToc(items);
    if (items[0]) setActiveId(items[0].id);
  }, [blog]);

  useEffect(() => {
    if (!contentRef.current || toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );

    toc.forEach((item) => {
      const el = contentRef.current?.querySelector(`[id="${CSS.escape(item.id)}"]`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc]);

  const relatedBlogs = useMemo(() => {
    if (!blog) return [];
    return allBlogs
      .filter((b) => b.id !== blog.id && (b.topic === blog.topic || b.category?.id === blog.category?.id))
      .slice(0, 3);
  }, [allBlogs, blog]);

  const { prev, next } = useMemo(() => {
    if (!blog || allBlogs.length === 0) return { prev: undefined as Blog | undefined, next: undefined as Blog | undefined };
    const sorted = [...allBlogs].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
    const idx = sorted.findIndex((b) => b.id === blog.id);
    return { prev: sorted[idx - 1], next: sorted[idx + 1] };
  }, [allBlogs, blog]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog || !commentForm.name.trim() || !commentForm.content.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/blogs/${blog.id}/comments`, commentForm);
      if (res.data?.status) {
        toast.success(t('blogPost.commentSuccess'));
        setCommentForm({ name: '', email: '', content: '' });
      } else {
        toast.error(t('blogPost.commentError'));
      }
    } catch {
      toast.error(t('blogPost.commentError'));
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToHeading = (id: string) => {
    const el = contentRef.current?.querySelector(`[id="${CSS.escape(id)}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
      setTocOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <BookOpen size={48} className="mb-4 text-slate-300" />
        <h2 className="mb-2 text-2xl font-bold text-slate-800 dark:text-white">{t('blogPost.notFound')}</h2>
        <Link to="/blogs" className="mt-4 inline-flex items-center gap-2 font-semibold text-primary">
          <ArrowLeft size={18} /> {t('blogPost.backToBlogs')}
        </Link>
      </div>
    );
  }

  const pageTitle = blog.title;
  const pageUrl = currentUrl;
  const tags = parseTags(blog.tags);

  return (
    <div className={cn('min-h-screen bg-white transition-colors', isDark && 'dark')}>
      <div className="bg-white pb-16 dark:bg-slate-950">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl shadow-2xl md:aspect-[21/9]">
              <img
                src={blog.image || '/placeholder-blog.jpg'}
                alt={blog.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
              <button
                onClick={() => setIsDark((v) => !v)}
                className="absolute end-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                aria-label={isDark ? t('blogPost.lightMode') : t('blogPost.darkMode')}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <li>
                  <Link to="/" className="inline-flex items-center gap-1 transition hover:text-primary">
                    <Home size={14} /> {t('blogPost.breadcrumbHome')}
                  </Link>
                </li>
                <li>
                  <ChevronRight size={14} />
                </li>
                <li>
                  <Link to="/blogs" className="transition hover:text-primary">
                    {t('blogPost.breadcrumbBlogs')}
                  </Link>
                </li>
                <li>
                  <ChevronRight size={14} />
                </li>
                <li className="max-w-[200px] truncate text-slate-700 dark:text-slate-200" aria-current="page">
                  {blog.title}
                </li>
              </ol>
            </nav>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {blog.topic && (
                <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary ring-1 ring-primary/20">
                  {blog.topic}
                </span>
              )}
              <h1 className="mb-4 text-3xl font-extrabold leading-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                {blog.title}
              </h1>
              {blog.subtitle && (
                <p className="mb-6 text-lg text-slate-600 dark:text-slate-300 sm:text-xl">{blog.subtitle}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                {blog.author && (
                  <span className="inline-flex items-center gap-1.5">
                    <User size={14} /> {blog.author}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} />
                  {t('blogPost.publishedOn')} {formatDate(blog.created_at)}
                </span>
                {blog.updated_at && blog.updated_at !== blog.created_at && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} />
                    {t('blogPost.updatedOn')} {formatDate(blog.updated_at)}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} />
                  {blog.reading_time ?? 5} {t('blogPost.readTime')}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Eye size={14} />
                  {blog.views ?? 0} {t('blogPost.views')}
                </span>
              </div>

              <div className="mt-6">
                <ShareButtons title={pageTitle} url={pageUrl} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main content */}
        <main className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Sticky Table of Contents */}
            <aside className="lg:col-span-3">
              <div className="sticky top-24 space-y-4">
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                  <button
                    onClick={() => setTocOpen((v) => !v)}
                    className="flex w-full items-center justify-between font-bold text-slate-900 dark:text-white lg:cursor-default"
                    aria-expanded={tocOpen}
                  >
                    <span className="inline-flex items-center gap-2">
                      <BookOpen size={18} className="text-primary" />
                      {t('blogPost.toc')}
                    </span>
                    <span className="text-slate-400 lg:hidden">{tocOpen ? '−' : '+'}</span>
                  </button>
                  <nav className={cn('mt-4', !tocOpen && 'hidden lg:block')} aria-label="Table of contents">
                    {toc.length === 0 ? (
                      <p className="text-sm text-slate-500">{t('blogPost.tocEmpty')}</p>
                    ) : (
                      <ul className="space-y-2">
                        {toc.map((item) => (
                          <li key={item.id} className={cn('border-s-2 transition', item.level === 3 ? 'ps-3' : 'ps-2')}>
                            <button
                              onClick={() => scrollToHeading(item.id)}
                              className={cn(
                                'block w-full text-start text-sm transition hover:text-primary',
                                activeId === item.id
                                  ? 'border-primary font-semibold text-primary'
                                  : 'border-transparent text-slate-600 dark:text-slate-300'
                              )}
                            >
                              {item.text}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </nav>
                </div>

                {/* Tags on desktop */}
                {tags.length > 0 && (
                  <div className="hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 lg:block">
                    <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">{t('blog.tagsTitle')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-primary hover:text-white dark:bg-slate-800 dark:text-slate-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Article */}
            <article className="lg:col-span-9">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div
                  ref={contentRef}
                  className="article-content prose prose-lg prose-slate max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: blog.description }}
                />

                {/* Tags mobile */}
                {tags.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2 lg:hidden">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Share bottom */}
                <div className="mt-10 border-t border-slate-100 pt-8 dark:border-slate-800">
                  <ShareButtons title={pageTitle} url={pageUrl} />
                </div>

                {/* Author */}
                <div className="mt-10">
                  <AuthorCard blog={blog} />
                </div>
              </motion.div>
            </article>
          </div>
        </main>

        {/* Related articles */}
        {relatedBlogs.length > 0 && (
          <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-primary" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('blogPost.relatedTitle')}</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((b) => (
                <RelatedCard key={b.id} blog={b} />
              ))}
            </div>
          </section>
        )}

        {/* Comments */}
        <section className="mx-auto mt-20 max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <MessageSquare className="text-primary" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t('blogPost.commentsTitle')}{' '}
              <span className="text-base font-medium text-slate-500 dark:text-slate-400">
                ({comments.length})
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/40">
                {t('blogPost.noComments')}
              </p>
            ) : (
              comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
            )}
          </div>

          <form
            onSubmit={handleCommentSubmit}
            className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60 sm:p-8"
          >
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">{t('blogPost.commentsTitle')}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="comment-name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('blogPost.commentName')} *
                </label>
                <input
                  id="comment-name"
                  type="text"
                  required
                  value={commentForm.name}
                  onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="comment-email" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('blogPost.commentEmail')}
                </label>
                <input
                  id="comment-email"
                  type="email"
                  value={commentForm.email}
                  onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="comment-message" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('blogPost.commentMessage')} *
              </label>
              <textarea
                id="comment-message"
                required
                rows={4}
                value={commentForm.content}
                onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-secondary transition hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {t('blogPost.commentSubmit')}
            </button>
          </form>
        </section>

        {/* Newsletter */}
        <section className="mx-auto mt-20 max-w-4xl px-4 sm:px-6 lg:px-8">
          <Newsletter />
        </section>

        {/* Prev / Next */}
        <section className="mx-auto mt-16 max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {prev ? <PrevNextCard blog={prev} direction="prev" /> : <div />}
            {next ? <PrevNextCard blog={next} direction="next" /> : <div />}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
          <CTABanner />
        </section>
      </div>
    </div>
  );
}
