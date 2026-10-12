import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { TextInput } from '@/components/text-input';
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

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const navLinks = [
    { label: 'Dashboard', to: ROUTES.DASHBOARD },
    { label: 'Mentors', to: ROUTES.MENTORS },
    { label: 'Sessions', to: ROUTES.SESSIONS },
    { label: 'Messages', to: ROUTES.MESSAGES },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-border flex items-center justify-between border-b px-8 py-4">
        <div className="flex items-center gap-8">
          <Link to={ROUTES.DASHBOARD} className="flex items-center">
            <Text variant="h3" as="span">
              Daleel
            </Text>
          </Link>
          <nav className="flex items-center gap-4">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-foreground underline underline-offset-4'
                      : 'text-muted hover:text-foreground'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <TextInput placeholder="Search mentors" className="w-56" />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Log out
          </Button>
          <Link to={ROUTES.PROFILE} title="View Profile">
            <div className="bg-secondary flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-white uppercase cursor-pointer hover:opacity-90">
              {getInitials(user?.name)}
            </div>
          </Link>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
