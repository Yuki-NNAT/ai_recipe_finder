import { Outlet } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Logo from './components/Logo';

/**
 * Split layout for login/register: a warm brand panel on the left (desktop)
 * and the form column on the right. Collapses to a single centered column
 * on mobile.
 */
export default function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-hero-glow lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Logo />

        <div className="max-w-md">
          <div className="mb-5 inline-flex items-center gap-2 rounded-pill bg-white/70 px-4 py-1.5 shadow-soft-sm">
            <Sparkles className="h-4 w-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-600">AI-powered cooking</span>
          </div>
          <h2 className="font-display text-4xl font-extrabold leading-tight text-ink">
            Cook smarter with your <span className="text-gradient">AI kitchen</span> companion.
          </h2>
          <p className="mt-4 text-ink/70">
            Discover healthy recipes, analyze nutrition, and plan your meals — all in one
            beautifully simple place.
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&q=80"
          alt="Fresh healthy food"
          className="pointer-events-none absolute -right-16 bottom-8 h-72 w-72 rounded-full object-cover opacity-90 shadow-soft-lg animate-float"
        />
      </div>

      {/* Form column */}
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8">
        <div className="mb-8 lg:hidden">
          <Logo />
        </div>
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
