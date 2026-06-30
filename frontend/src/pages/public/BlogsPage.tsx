import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Tag,
  BookOpen,
  TrendingUp,
  Mail,
  Sparkles,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface Blog {
  id: number;
  title: string;
  description: string;
  image?: string | null;
  author?: string | null;
  topic?: string | null;
  reading_time?: number;
  views?: number;
  tags?: string | null;
  created_at?: string;
  category?: { name: string } | null;
}

const TOPICS = ['Business', 'Technology', 'Education', 'Healthcare', 'Marketing', 'Company News'];

const TOPIC_COLORS: Record<string, string> = {
  Business: 'bg-blue-50 text-blue-600 ring-blue-200',
  Technology: 'bg-violet-50 text-violet-600 ring-violet-200',
  Education: 'bg-emerald-50 text-emerald-600 ring-emerald-200',
  Healthcare: 'bg-rose-50 text-rose-600 ring-rose-200',
  Marketing: 'bg-amber-50 text-amber-600 ring-amber-200',
  'Company News': 'bg-slate-100 text-slate-600 ring-slate-200',
};

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

function extractTags(blogs: Blog[]) {
  const all = blogs.flatMap((b) => (b.tags || '').split(',').map((t) => t.trim()).filter(Boolean));
  const counts: Record<string, number> = {};
  all.forEach((t) => { counts[t] = (counts[t] || 0) + 1; });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
    .slice(0, 12);
}

function ArticleMeta({ blog, className = '' }: { blog: Blog; className?: string }) {
  const { t } = useTranslation();
  return (
    <div className={`flex flex-wrap items-center gap-3 text-xs text-slate-500 ${className}`}>
      {blog.author && (
        <span className="inline-flex items-center gap-1">
          <User size={12} />
          {blog.author}
        </span>
      )}
      {blog.created_at && (
        <span className="inline-flex items-center gap-1">
          <Calendar size={12} />
          {formatDate(blog.created_at)}
        </span>
      )}
      <span className="inline-flex items-center gap-1">
        <Clock size={12} />
        {blog.reading_time ?? 5} {t('blog.minutes', 'min read')}
      </span>
    </div>
  );
}

function CategoryBadge({ topic }: { topic?: string | null }) {
  const color = (topic && TOPIC_COLORS[topic]) || 'bg-slate-100 text-slate-600 ring-slate-200';
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${color}`}>
      {topic || 'General'}
    </span>
  );
}

function HeroSection() {
  const { t } = useTranslation();
  return (
    <section className="relative flex min-h-[45vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1920&q=80"
          alt="Blog"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/95 via-secondary/85 to-primary/80" />
      </div>
      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center text-white">
        <nav className="mb-4 text-sm text-white/80">
          <Link to="/" className="hover:text-white hover:underline">{t('common.home', 'Home')}</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{t('common.blogs', 'Blog')}</span>
        </nav>
        <h1 className="text-4xl font-extrabold sm:text-5xl">{t('blog.hero.title', 'Our Blog')}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg opacity-90">
          {t('blog.hero.subtitle', 'Insights, tips, and updates for healthcare professionals and lifelong learners.')}
        </p>
      </div>
    </section>
  );
}

function SearchFilters({
  search,
  setSearch,
  topic,
  setTopic,
  sort,
  setSort,
}: {
  search: string;
  setSearch: (v: string) => void;
  topic: string;
  setTopic: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <section className="bg-white py-6 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('blog.searchPlaceholder', 'Search articles...')}
            className="w-full rounded-xl border border-slate-200 py-2.5 pe-4 ps-10 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Filter className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm outline-none focus:border-primary"
            >
              <option value="">{t('blog.allCategories', 'All Categories')}</option>
              {TOPICS.map((tpc) => (
                <option key={tpc} value={tpc}>{tpc}</option>
              ))}
            </select>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-sm outline-none focus:border-primary"
          >
            <option value="latest">{t('blog.sortLatest', 'Latest')}</option>
            <option value="popular">{t('blog.sortPopular', 'Popular')}</option>
            <option value="oldest">{t('blog.sortOldest', 'Oldest')}</option>
          </select>
        </div>
      </div>
    </section>
  );
}

function FeaturedArticle({ blog }: { blog: Blog }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-lg">
          <div className="grid lg:grid-cols-2">
            <div className="relative h-64 lg:h-auto">
              <img
                src={blog.image || 'https://placehold.co/800x500?text=Blog'}
                alt={blog.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10">
              <CategoryBadge topic={blog.topic} />
              <h2 className="mt-4 text-2xl font-extrabold text-secondary sm:text-3xl">{blog.title}</h2>
              <div className="mt-3 line-clamp-3 text-slate-600" dangerouslySetInnerHTML={{ __html: blog.description }} />
              <ArticleMeta blog={blog} className="mt-5" />
              <Link
                to={`/blogs/${blog.id}`}
                className="group mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-primary/90"
              >
                {t('blog.readMore', 'Read More')}
                <ArrowRight size={16} className={`transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ topic, count, onClick }: { topic: string; count: number; onClick: () => void }) {
  const color = TOPIC_COLORS[topic] || 'bg-slate-100 text-slate-600 ring-slate-200';
  return (
    <motion.button
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`rounded-2xl p-5 text-start shadow-sm ring-1 ring-inset transition-all hover:shadow-md ${color}`}
    >
      <BookOpen className="mb-3" size={24} />
      <h3 className="text-lg font-extrabold">{topic}</h3>
      <p className="mt-1 text-sm opacity-90">{count} articles</p>
    </motion.button>
  );
}

function BlogCard({ blog }: { blog: Blog }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-[1.25rem] border border-slate-100 bg-white shadow-sm transition-all hover:shadow-lg"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={blog.image || 'https://placehold.co/600x400?text=Blog'}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute start-4 top-4">
          <CategoryBadge topic={blog.topic} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-extrabold text-secondary transition-colors group-hover:text-primary">{blog.title}</h3>
        <div className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: blog.description }} />
        <ArticleMeta blog={blog} className="mt-4" />
        <Link
          to={`/blogs/${blog.id}`}
          className={`mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary transition-all ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
        >
          {t('blog.readMore', 'Read More')}
          <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
        </Link>
      </div>
    </motion.div>
  );
}

function PopularArticles({ blogs }: { blogs: Blog[] }) {
  const { t } = useTranslation();
  const popular = useMemo(() => [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5), [blogs]);
  if (popular.length === 0) return null;
  return (
    <div className="rounded-[1.35rem] border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-secondary">
        <TrendingUp size={20} className="text-primary" />
        {t('blog.popularTitle', 'Popular Articles')}
      </h3>
      <div className="space-y-4">
        {popular.map((blog) => (
          <Link key={blog.id} to={`/blogs/${blog.id}`} className="group flex gap-3">
            <img
              src={blog.image || 'https://placehold.co/100x100?text=B'}
              alt={blog.title}
              className="h-14 w-14 rounded-xl object-cover"
            />
            <div>
              <h4 className="text-sm font-bold text-secondary transition-colors group-hover:text-primary line-clamp-2">{blog.title}</h4>
              <p className="mt-1 text-xs text-slate-500">{formatDate(blog.created_at)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Tags({ tags, onTag }: { tags: string[]; onTag: (tag: string) => void }) {
  const { t } = useTranslation();
  if (tags.length === 0) return null;
  return (
    <div className="rounded-[1.35rem] border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-secondary">
        <Tag size={20} className="text-primary" />
        {t('blog.tagsTitle', 'Popular Tags')}
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTag(tag)}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors hover:border-primary hover:text-primary"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

function Newsletter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { toast.error(t('footer.newsletter.invalid', 'Please enter a valid email')); return; }
    toast.success(t('blog.subscribeSuccess', 'Subscribed to blog updates!'));
    setEmail('');
  };
  return (
    <div className="rounded-[1.35rem] bg-gradient-to-br from-secondary to-primary p-6 text-white shadow-lg">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
        <Mail size={20} />
      </div>
      <h3 className="text-lg font-extrabold">{t('blog.newsletterTitle', 'Subscribe to Our Blog')}</h3>
      <p className="mt-2 text-sm text-white/80">{t('blog.newsletterSubtitle', 'Get the latest articles and updates delivered to your inbox.')}</p>
      <form onSubmit={submit} className="mt-4 space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('blog.emailPlaceholder', 'Enter your email')}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60 outline-none focus:border-white"
        />
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2 text-sm font-bold text-secondary transition-colors hover:bg-gray-100"
        >
          <Sparkles size={14} />
          {t('blog.subscribe', 'Subscribe')}
        </button>
      </form>
    </div>
  );
}

function Pagination({ page, total, onPage }: { page: number; total: number; onPage: (p: number) => void }) {
  const { t } = useTranslation();
  if (total <= 1) return null;
  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label={t('testimonials.prev', 'Previous')}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-secondary shadow-sm transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
      >
        <ChevronLeft size={18} />
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold shadow-sm transition-colors ${
            p === page ? 'bg-primary text-white' : 'border border-slate-200 bg-white text-secondary hover:border-primary hover:text-primary'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPage(Math.min(total, page + 1))}
        disabled={page === total}
        aria-label={t('testimonials.next', 'Next')}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-secondary shadow-sm transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

function CTABanner() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  return (
    <section className="relative overflow-hidden bg-secondary py-16 text-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary" />
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl">{t('blog.cta.title', 'Ready to Advance Your Medical Career?')}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">{t('blog.cta.subtitle', 'Explore our exam packages and start learning with expert-curated content today.')}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/packages"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-bold text-secondary shadow-lg transition-all hover:-translate-y-1 hover:bg-gray-100"
          >
            {t('blog.cta.explore', 'Explore Packages')}
            <ArrowRight size={18} className={`transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 bg-white/10 px-8 py-3.5 font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/20"
          >
            {t('blog.cta.contact', 'Contact Us')}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function BlogsPage() {
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState('');
  const [topic, setTopic] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    api.get('/blogs/index').then((res) => setBlogs(res.data?.data?.blogs || []));
  }, []);

  useEffect(() => { setPage(1); }, [search, topic, sort]);

  const filtered = useMemo(() => {
    let list = [...blogs];
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((b) =>
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        (b.tags || '').toLowerCase().includes(q)
      );
    }
    if (topic) list = list.filter((b) => b.topic === topic);
    if (sort === 'latest') list.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    if (sort === 'oldest') list.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
    if (sort === 'popular') list.sort((a, b) => (b.views || 0) - (a.views || 0));
    return list;
  }, [blogs, search, topic, sort]);

  const featured = filtered[0];
  const latest = featured ? filtered.slice(1) : filtered;
  const totalPages = Math.max(1, Math.ceil(latest.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const paginated = latest.slice((currentPage - 1) * perPage, currentPage * perPage);

  const topicCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    blogs.forEach((b) => { if (b.topic) counts[b.topic] = (counts[b.topic] || 0) + 1; });
    return counts;
  }, [blogs]);

  const tags = useMemo(() => extractTags(blogs), [blogs]);

  if (blogs.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <HeroSection />
      <SearchFilters search={search} setSearch={setSearch} topic={topic} setTopic={setTopic} sort={sort} setSort={setSort} />

      {featured && <FeaturedArticle blog={featured} />}

      {/* Categories */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-2xl font-extrabold text-secondary">{t('blog.categoriesTitle', 'Browse by Category')}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((tpc) => (
              <CategoryCard key={tpc} topic={tpc} count={topicCounts[tpc] || 0} onClick={() => setTopic(tpc)} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest + Sidebar */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-2xl font-extrabold text-secondary">{t('blog.latestTitle', 'Latest Articles')}</h2>
              {paginated.length === 0 ? (
                <p className="text-slate-600">{t('blog.noResults', 'No articles found.')}</p>
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-2">
                    {paginated.map((blog) => (
                      <BlogCard key={blog.id} blog={blog} />
                    ))}
                  </div>
                  <Pagination page={currentPage} total={totalPages} onPage={setPage} />
                </>
              )}
            </div>
            <aside className="space-y-6">
              <PopularArticles blogs={blogs} />
              <Tags tags={tags} onTag={(tag) => setSearch(tag)} />
              <Newsletter />
            </aside>
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  );
}
