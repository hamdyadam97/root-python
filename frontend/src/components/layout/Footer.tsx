import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
} from 'lucide-react';

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary/10 bg-white text-secondary shadow-sm transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {children}
    </a>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-secondary">{title}</h3>
      {children}
    </div>
  );
}

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-2 text-sm text-slate-600 transition-colors duration-300 hover:text-primary"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-primary/40 transition-all duration-300 group-hover:h-2 group-hover:w-2 group-hover:bg-primary" />
      <span className="transition-transform duration-300 group-hover:translate-x-1">
        {label}
      </span>
    </Link>
  );
}

export function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error(t('footer.newsletter.invalid', 'Please enter a valid email address.'));
      return;
    }
    toast.success(t('footer.newsletter.success', 'Thank you for subscribing!'));
    setEmail('');
  };

  const quickLinks = [
    { to: '/', label: t('footer.links.home', 'Home') },
    { to: '/about', label: t('footer.links.about', 'About Us') },
    { to: '/courses', label: t('footer.links.courses', 'Courses') },
    { to: '/certifications', label: t('footer.links.certifications', 'Certifications') },
    { to: '/instructors', label: t('footer.links.instructors', 'Instructors') },
    { to: '/blogs', label: t('footer.links.blog', 'Blog') },
    { to: '/contact', label: t('footer.links.contact', 'Contact Us') },
  ];

  const categories = [
    { to: '/packages', label: t('footer.categories.medical', 'Medical Courses') },
    { to: '/packages', label: t('footer.categories.nursing', 'Nursing Courses') },
    { to: '/packages', label: t('footer.categories.pharmacy', 'Pharmacy Courses') },
    { to: '/packages', label: t('footer.categories.dentistry', 'Dentistry Courses') },
    { to: '/packages', label: t('footer.categories.online', 'Online Training') },
    { to: '/packages', label: t('footer.categories.workshops', 'Workshops') },
  ];

  return (
    <footer className="relative overflow-hidden rounded-t-[2.5rem] border-t border-slate-200 bg-white text-secondary shadow-[0_-8px_40px_rgba(0,39,112,0.06)]">
      {/* Soft background pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 10%, rgba(6,191,176,0.06), transparent 35%), radial-gradient(circle at 90% 0%, rgba(0,39,112,0.04), transparent 35%)',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Company Information */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap size={24} />
              </div>
              <span className="text-2xl font-extrabold text-secondary">{t('common.appName')}</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm font-medium leading-relaxed text-primary">
              {t('footer.tagline', 'Empowering healthcare professionals through accredited medical education.')}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
              {t(
                'footer.description',
                'RootsExams provides high-quality medical training, mock exams, and accredited courses to help healthcare professionals advance their careers.'
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <FooterColumn title={t('footer.quickLinks', 'Quick Links')}>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <FooterLink to={link.to} label={link.label} />
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </div>

          {/* Categories */}
          <div className="lg:col-span-2">
            <FooterColumn title={t('footer.categoriesTitle', 'Categories')}>
              <ul className="space-y-3">
                {categories.map((cat, idx) => (
                  <li key={idx}>
                    <FooterLink to={cat.to} label={cat.label} />
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </div>

          {/* Contact & Follow */}
          <div className="space-y-8 lg:col-span-4">
            {/* Contact Information */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6 backdrop-blur-sm">
              <h3 className="mb-4 text-lg font-bold text-secondary">
                {t('footer.contact', 'Contact Us')}
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0 text-primary" />
                  <span dir="ltr">+962 79 123 4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <MessageCircle size={16} className="shrink-0 text-primary" />
                  <span dir="ltr">+962 79 123 4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="shrink-0 text-primary" />
                  <a
                    href="mailto:info@rootsexams.com"
                    className="transition-colors hover:text-primary"
                  >
                    info@rootsexams.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
                  <span>{t('footer.address', 'Amman, Jordan — Medical District, Building 12')}</span>
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-secondary">
                {t('footer.followUs', 'Follow Us')}
              </h3>
              <div className="flex flex-wrap gap-3">
                <SocialIcon href="https://facebook.com" label={t('footer.social.facebook', 'Facebook')}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </SocialIcon>
                <SocialIcon href="https://instagram.com" label={t('footer.social.instagram', 'Instagram')}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </SocialIcon>
                <SocialIcon href="https://linkedin.com" label={t('footer.social.linkedin', 'LinkedIn')}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </SocialIcon>
                <SocialIcon href="https://x.com" label={t('footer.social.x', 'X (Twitter)')}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </SocialIcon>
                <SocialIcon href="https://youtube.com" label={t('footer.social.youtube', 'YouTube')}>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </SocialIcon>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-14">
          <div className="relative overflow-hidden rounded-3xl bg-secondary p-8 text-white shadow-lg sm:p-10">
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-2xl font-bold sm:text-3xl">
                  {t('footer.newsletter.title', 'Subscribe to our newsletter')}
                </h3>
                <p className="mt-2 text-sm text-white/80">
                  {t(
                    'footer.newsletter.subtitle',
                    'Get the latest medical courses, exam tips, and updates delivered to your inbox.'
                  )}
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  {t('footer.newsletter.placeholder', 'Enter your email')}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.newsletter.placeholder', 'Enter your email')}
                  className="w-full flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 outline-none transition-colors focus:border-primary focus:bg-white/20"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-primary/90 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Send size={16} />
                  {t('footer.newsletter.button', 'Subscribe')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-100 bg-secondary py-5 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs sm:flex-row sm:px-6 lg:px-8">
          <p className="text-center sm:text-start">
            {t('footer.bottom.copyright', '© {{year}} RootsExams. All rights reserved.', {
              year: new Date().getFullYear(),
            })}
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="transition-colors duration-300 hover:text-primary"
            >
              {t('footer.bottom.privacy', 'Privacy Policy')}
            </Link>
            <Link
              to="/terms"
              className="transition-colors duration-300 hover:text-primary"
            >
              {t('footer.bottom.terms', 'Terms & Conditions')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
