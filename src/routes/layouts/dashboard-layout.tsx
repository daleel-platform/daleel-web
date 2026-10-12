import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import {
  Calendar,
  Compass,
  LogOut,
  MessageSquare,
  Search,
  Sparkles,
} from 'lucide-react';

import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { DaleelLogo } from '@/components/logo';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useCurrentUser } from '@/features/auth/hooks/use-current-user';
import { ROUTES } from '@/routes/paths';

export function DashboardLayout() {
  const { logout } = useAuth();
  const { data: user } = useCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const navLinks = [
    { label: 'Find Mentors', to: ROUTES.MENTORS, icon: Compass },
    { label: 'My Sessions', to: ROUTES.SESSIONS, icon: Calendar },
    { label: 'Messages', to: ROUTES.MESSAGES, icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Application Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          {/* Left: Brand & Navigation */}
          <div className="flex items-center gap-8">
            <Link to={ROUTES.MENTORS} aria-label="Daleel Mentors">
              <DaleelLogo size="md" />
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all select-none ${
                        isActive
                          ? 'bg-teal-50 text-teal-800 shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Right: Quick Search, Become a Mentor CTA, User Info, Actions */}
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search mentors or topics..."
                className="h-9 w-60 rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-8 text-xs text-slate-800 placeholder:text-slate-400 transition-all focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-600/10"
              />
              <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                /
              </kbd>
            </div>

            <Link to={ROUTES.PROFILE} className="hidden sm:inline-flex">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Sparkles className="h-3.5 w-3.5 text-amber-500" />}
                className="border-teal-200 text-teal-800 hover:bg-teal-50 hover:border-teal-300"
              >
                Become a Mentor
              </Button>
            </Link>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            <Link
              to={ROUTES.PROFILE}
              className="flex items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-slate-100"
              title="View your profile"
            >
              <Avatar name={user?.name} size="sm" status="online" />
              <div className="hidden text-left lg:block">
                <p className="text-xs font-bold text-slate-800 leading-none">
                  {user?.name || 'My Account'}
                </p>
              </div>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-600"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex border-t border-slate-100 px-4 py-2 md:hidden overflow-x-auto gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shrink-0 ${
                    isActive
                      ? 'bg-teal-50 text-teal-800'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
