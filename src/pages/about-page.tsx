import { Link } from 'react-router';

import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { ROUTES } from '@/routes/paths';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-border border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Text variant="h3" as="span">
            Daleel
          </Text>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm text-slate-600 transition hover:text-slate-900"
            >
              How it works
            </a>

            <a
              href="#why-daleel"
              className="text-sm text-slate-600 transition hover:text-slate-900"
            >
              Why Daleel
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to={ROUTES.LOGIN}>
              <Button variant="outline">Login</Button>
            </Link>

            <Link to={ROUTES.REGISTER}>
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-72px)] max-w-6xl items-center gap-16 px-6 py-20 lg:grid-cols-2">
          <div>
            <Text
              variant="h1"
              className="max-w-2xl text-5xl leading-[1.08] tracking-tight"
            >
              Grow your career with the right guidance.
            </Text>

            <Text
              variant="body"
              className="mt-6 max-w-xl text-base leading-7 text-slate-600"
            >
              Daleel connects you with experienced professionals who can help
              you navigate career decisions, build valuable skills, and move
              forward with confidence.
            </Text>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={ROUTES.REGISTER}>
                <Button size="lg">Get Started</Button>
              </Link>

              <a href="#how-it-works">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              <Text variant="body-sm">✓ Personalized guidance</Text>
              <Text variant="body-sm">✓ Experienced mentors</Text>
              <Text variant="body-sm">✓ Flexible sessions</Text>
            </div>
          </div>

          <div className="border-border bg-surface rounded-3xl border p-8 shadow-sm">
            <Text variant="caption">Your mentorship journey</Text>

            <Text variant="h2" className="mt-2">
              Build clarity. Take the next step.
            </Text>

            <Text variant="body-sm" className="mt-3 max-w-md leading-6">
              Set your goals, connect with the right mentor, and get practical
              guidance tailored to where you want to go.
            </Text>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                  1
                </div>

                <div>
                  <Text variant="body">Define your goals</Text>
                  <Text variant="muted">Tell us what you want to achieve.</Text>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                  2
                </div>

                <div>
                  <Text variant="body">Meet the right mentor</Text>
                  <Text variant="muted">
                    Connect with someone who understands your path.
                  </Text>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                  3
                </div>

                <div>
                  <Text variant="body">Move forward with confidence</Text>
                  <Text variant="muted">
                    Turn guidance into meaningful progress.
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-border border-y bg-white px-6 py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <Text variant="h2">How Daleel Works</Text>

              <Text variant="body" className="mt-3 text-slate-600">
                A simple way to get the guidance you need.
              </Text>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="border-border rounded-2xl border p-7 text-center shadow-sm">
                <div className="bg-primary mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white">
                  1
                </div>

                <Text variant="h3" className="mt-5">
                  Create your profile
                </Text>

                <Text variant="body-sm" className="mt-3 leading-6">
                  Tell us about your goals, interests, and what you want to
                  achieve.
                </Text>
              </div>

              <div className="border-border rounded-2xl border p-7 text-center shadow-sm">
                <div className="bg-primary mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white">
                  2
                </div>

                <Text variant="h3" className="mt-5">
                  Find the right mentor
                </Text>

                <Text variant="body-sm" className="mt-3 leading-6">
                  Discover experienced professionals who match your goals and
                  interests.
                </Text>
              </div>

              <div className="border-border rounded-2xl border p-7 text-center shadow-sm">
                <div className="bg-primary mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white">
                  3
                </div>

                <Text variant="h3" className="mt-5">
                  Start growing
                </Text>

                <Text variant="body-sm" className="mt-3 leading-6">
                  Book sessions, get practical advice, and take your next step
                  with confidence.
                </Text>
              </div>
            </div>
          </div>
        </section>

        <section id="why-daleel" className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <Text variant="h2">Why Daleel?</Text>

              <Text variant="body" className="mt-3 text-slate-600">
                More than just conversations — real support for your career
                journey.
              </Text>
            </div>

            <div className="mt-12 grid gap-10 md:grid-cols-3">
              <div className="text-center">
                <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full text-primary">
                  ✓
                </div>

                <Text variant="h3" className="mt-4">
                  Career Guidance
                </Text>

                <Text variant="body-sm" className="mt-2 leading-6">
                  Get insights and advice from professionals who understand your
                  field.
                </Text>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full text-primary">
                  ↑
                </div>

                <Text variant="h3" className="mt-4">
                  Skill Development
                </Text>

                <Text variant="body-sm" className="mt-2 leading-6">
                  Learn practical skills and gain new perspectives that help you
                  grow.
                </Text>
              </div>

              <div className="text-center">
                <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full text-primary">
                  ◎
                </div>

                <Text variant="h3" className="mt-4">
                  Real Connections
                </Text>

                <Text variant="body-sm" className="mt-2 leading-6">
                  Build meaningful relationships with mentors who genuinely care
                  about your progress.
                </Text>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-border border-t px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Text variant="h3">Daleel</Text>
            <Text variant="muted" className="mt-1">
              Guidance. Growth. Real connections.
            </Text>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-slate-500">
            <a href="#how-it-works" className="hover:text-slate-900">
              How it works
            </a>

            <a href="#why-daleel" className="hover:text-slate-900">
              Why Daleel
            </a>

            <Link to={ROUTES.LOGIN} className="hover:text-slate-900">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
