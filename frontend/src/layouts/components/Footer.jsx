import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa6';
import { PRIMARY_NAV } from '../navigation';
import { APP_NAME } from '@/constants';
import Logo from './Logo';

// Danh sách mạng xã hội
const SOCIAL_LINKS = [
  { icon: FaFacebookF, label: 'Facebook', href: '#' },
  { icon: FaInstagram, label: 'Instagram', href: '#' },
  { icon: FaTwitter, label: 'Twitter', href: '#' },
];

// Danh sách điều khoản pháp lý
const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookies' },
];

/**
 * Hàm chuẩn hóa tên các mục Navigation hiển thị mượt hơn
 */
const formatLabel = (label = '') => {
  const normalized = label.toLowerCase();
  if (normalized === 'aichat') return 'AI Assistant';
  if (normalized === 'calculator') return 'Nutrition Calculator';
  return label.charAt(0).toUpperCase() + label.slice(1);
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 w-full rounded-3xl bg-surface border border-primary-100/70 p-8 shadow-soft-sm sm:p-10">
      <div className="grid gap-8 md:grid-cols-12">
        {/* Cột 1: Brand Logo & Intro Slogan */}
        <div className="md:col-span-7 lg:col-span-8 max-w-md">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Your intelligent culinary companion — personalized recipes, smart nutrition insights, and effortless meal planning powered by AI.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-all duration-200 hover:bg-primary-500 hover:text-white hover:scale-105"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Cột 2: Primary Navigation Links */}
        <div className="md:col-span-5 lg:col-span-4 lg:flex lg:justify-end">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-ink uppercase tracking-wider">Explore</h3>
            <ul className="space-y-3">
              {PRIMARY_NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm text-muted transition-colors duration-150 hover:text-primary-600"
                  >
                    {formatLabel(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Dòng Copyright & Legal Footer Bottom */}
      <div className="mt-10 flex flex-col gap-4 border-t border-primary-100/70 pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {currentYear} {APP_NAME}. All rights reserved.</p>
        <div className="flex flex-wrap gap-5">
          {LEGAL_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              to={href}
              className="transition-colors duration-150 hover:text-primary-600"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}