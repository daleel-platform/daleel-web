import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { TextInput } from '@/components/text-input';

const matchedMentors = [
  {
    name: 'Ahmed Nasser',
    role: 'Senior Product Manager, Careem',
    focus: 'Product strategy, career transitions',
  },
  {
    name: 'Lina Haddad',
    role: 'Engineering Lead, Vodafone Egypt',
    focus: 'Technical leadership, system design',
  },
  {
    name: 'Youssef Fathy',
    role: 'UX Director, freelance',
    focus: 'Portfolio reviews, design careers',
  },
];

export function DashboardPage() {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const profileCompletion = 60;

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserName(parsedData.name);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-border flex items-center justify-between border-b px-8 py-4">
        <Text variant="h3" as="span">
          Daleel
        </Text>
        <div className="flex items-center gap-3">
          <TextInput placeholder="Search mentors" className="w-56" />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Log out
          </Button>
          <div className="bg-secondary flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-white uppercase">
            {getInitials(userName)}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-10 px-8 py-10">
        <div>
          <Text variant="h1">Good afternoon, {userName}</Text>
          <Text variant="muted" className="mt-1">
            Your next mentoring session is coming up.
          </Text>
        </div>

        <section className="border-primary bg-surface rounded-xl border-l-4 p-6 shadow-sm">
          <Text variant="caption">Thursday, October 2 · 4:00 PM</Text>
          <Text variant="h2" className="mt-1">
            Product Management Career Path
          </Text>
          <Text variant="body-sm" className="mt-1">
            with Ahmed Nasser
          </Text>
          <div className="mt-4 flex gap-3">
            <Button variant="primary">Join session</Button>
            <Button variant="ghost">Reschedule</Button>
          </div>
        </section>

        <section className="border-border rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <Text variant="h3">Finish setting up your profile</Text>
            <Text variant="muted">{profileCompletion}%</Text>
          </div>
          <div className="bg-border mt-3 h-2 w-full rounded-full">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          <Text variant="body-sm" className="mt-3">
            Mentors are more likely to accept requests from complete profiles.
          </Text>
          <div className="mt-4 flex items-end gap-3">
            <TextInput
              label="LinkedIn profile"
              placeholder="linkedin.com/in/your-name"
              className="flex-1"
            />
            <Button variant="secondary">Save</Button>
          </div>
        </section>

        <section>
          <Text variant="h3" className="mb-4">
            Mentors matched to you
          </Text>
          <div className="border-border divide-border divide-y border-t border-b">
            {matchedMentors.map((mentor) => (
              <div
                key={mentor.name}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <Text variant="body">{mentor.name}</Text>
                  <Text variant="muted">{mentor.role}</Text>
                  <Text variant="caption" className="mt-0.5">
                    {mentor.focus}
                  </Text>
                </div>
                <Button variant="outline" size="sm">
                  Request session
                </Button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
