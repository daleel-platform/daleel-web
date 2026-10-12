import { Link } from 'react-router';
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Compass,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';

import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { DaleelLogo } from '@/components/logo';
import { Text } from '@/components/text';
import { ROUTES } from '@/routes/paths';

const featuredMentors = [
  {
    name: 'Sarah Mansour',
    role: 'Staff Engineer at Stripe',
    experience: '11 yrs exp',
    rating: '5.0',
    reviewsCount: 38,
    skills: ['System Design', 'Tech Leadership', 'Distributed Systems'],
    bio: 'Helping engineers bridge the gap from Senior to Staff+ with structured system architecture and impact frameworks.',
  },
  {
    name: 'Omar Sherif',
    role: 'VP of Product at Careem',
    experience: '14 yrs exp',
    rating: '4.9',
    reviewsCount: 52,
    skills: ['Product Strategy', 'Growth', 'Executive Presence'],
    bio: 'Former founder turned product leader. I coach PMs on roadmapping, stakeholder management, and career jumps.',
  },
  {
    name: 'Lina Haddad',
    role: 'Design Director at Instabug',
    experience: '9 yrs exp',
    rating: '4.95',
    reviewsCount: 29,
    skills: ['Product Design', 'Design Systems', 'Portfolio Review'],
    bio: 'Passionate about crafting world-class digital experiences and mentoring designers to crack top international roles.',
  },
];

const companies = [
  'Careem',
  'Vodafone',
  'Stripe',
  'Instabug',
  'Fawry',
  'Swvl',
  'Microsoft',
  'Talabat',
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-teal-100 selection:text-teal-900">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to={ROUTES.HOME} aria-label="Daleel Home">
            <DaleelLogo size="md" showTagline />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-teal-700"
            >
              How it works
            </a>
            <a
              href="#mentors"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-teal-700"
            >
              Featured Mentors
            </a>
            <Link
              to={`${ROUTES.REGISTER}?intent=mentor`}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-teal-700"
            >
              Become a Mentor
            </Link>
            <a
              href="#why-daleel"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-teal-700"
            >
              Why Daleel
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to={ROUTES.LOGIN}>
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>

            <Link to={ROUTES.REGISTER}>
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-teal-50/40 via-background to-background border-b border-slate-200/60">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
              {/* Left Column: Headlines & Call to Actions */}
              <div className="lg:col-span-7 flex flex-col items-start">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl md:leading-[1.12]">
                  Navigate your career path with{' '}
                  <span className="text-teal-700 underline decoration-amber-400 decoration-wavy decoration-2 underline-offset-8">
                    senior mentors
                  </span>
                  .
                </h1>

                <p className="mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
                  Connect 1-on-1 with vetted tech leads, product managers, and
                  executives from world-class companies. Break through career
                  plateaus, master system design, and accelerate your growth.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link to={`${ROUTES.REGISTER}?intent=mentee`}>
                    <Button
                      size="lg"
                      variant="primary"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Find a Mentor
                    </Button>
                  </Link>

                  <Link to={`${ROUTES.REGISTER}?intent=mentor`}>
                    <Button size="lg" variant="outline">
                      Become a Mentor
                    </Button>
                  </Link>
                </div>

                {/* Social Proof */}
                <div className="mt-12 flex flex-wrap items-center gap-6 pt-6 border-t border-slate-200/70">
                  <div className="flex -space-x-2">
                    <Avatar name="Sarah Mansour" size="sm" />
                    <Avatar name="Omar Sherif" size="sm" />
                    <Avatar name="Lina Haddad" size="sm" />
                    <Avatar name="Youssef Fathy" size="sm" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                      <span className="ml-1 text-xs font-bold text-slate-800">
                        4.95 / 5
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      from 3,500+ booked 1-on-1 sessions
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Spotlight Mockup */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-200/50">
                  {/* Top card bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                      <span className="text-xs font-bold text-emerald-700 tracking-wide uppercase">
                        Active Mentor Spotlight
                      </span>
                    </div>
                    <Badge variant="primary" size="sm">
                      Top Rated
                    </Badge>
                  </div>

                  {/* Mentor mini card */}
                  <div className="mt-5 flex items-start gap-4">
                    <Avatar
                      name="Ahmed Nasser"
                      size="lg"
                      status="online"
                      className="ring-2 ring-teal-100"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Text variant="h3">Ahmed Nasser</Text>
                        <span className="text-xs font-bold text-teal-700">
                          $45/hr
                        </span>
                      </div>
                      <Text variant="muted">Senior Staff PM, Careem</Text>
                      <div className="mt-1 flex items-center gap-1 text-amber-500">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs font-bold text-slate-700">
                          4.98
                        </span>
                        <span className="text-xs text-slate-400">
                          (64 sessions)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills pills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    <Badge variant="default" size="sm">
                      Product Strategy
                    </Badge>
                    <Badge variant="default" size="sm">
                      Career Transition
                    </Badge>
                    <Badge variant="default" size="sm">
                      Interview Prep
                    </Badge>
                  </div>

                  {/* Mock session booking preview */}
                  <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200/80 p-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <CalendarCheck className="h-4 w-4 text-teal-700" />
                        Next Available Slot
                      </span>
                      <span className="text-teal-700 font-bold">Tomorrow</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      Thursday, Oct 15 · 4:00 PM (45 mins)
                    </div>
                    <Link to={ROUTES.REGISTER} className="mt-3 block">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full text-xs"
                      >
                        Book Discovery Call
                      </Button>
                    </Link>
                  </div>

                  {/* Floating Metric Badge */}
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-teal-50/80 border border-teal-200/60 p-2.5 text-xs text-teal-900">
                    <CheckCircle2 className="h-4 w-4 text-teal-700 shrink-0" />
                    <span className="font-medium">
                      94% of mentees landed promotions or offers within 6
                      months.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brand / Partner strip */}
        <section className="border-b border-slate-200/60 bg-white py-10">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Mentors guiding talent from top industry organizations
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {companies.map((company) => (
                <span
                  key={company}
                  className="text-base font-bold text-slate-400 tracking-tight transition hover:text-slate-800"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-background">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="primary" size="md">
                Three Simple Steps
              </Badge>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                How Daleel guides your path
              </h2>
              <p className="mt-4 text-base text-slate-600">
                Designed for practical progress. No guesswork, no generic tips —
                just focused, actionable guidance.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <Card hoverable className="relative flex flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 font-bold text-lg">
                  1
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  Discover Your Match
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">
                  Search mentors by role, industry experience, tech stack, or
                  specific challenge. Read candid reviews and see their exact
                  career journey.
                </p>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-teal-700">
                  <Compass className="h-4 w-4" />
                  <span>Targeted filtering</span>
                </div>
              </Card>

              <Card hoverable className="relative flex flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 font-bold text-lg">
                  2
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  Book 1-on-1 Sessions
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">
                  Select available times directly from the mentor's calendar.
                  Share your agenda and questions upfront so every minute
                  counts.
                </p>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-teal-700">
                  <CalendarCheck className="h-4 w-4" />
                  <span>Seamless scheduling</span>
                </div>
              </Card>

              <Card hoverable className="relative flex flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 font-bold text-lg">
                  3
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  Accelerate Your Growth
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">
                  Leave each session with a concrete roadmap. Track key
                  milestones, receive feedback on portfolios or code, and stay
                  in touch.
                </p>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-teal-700">
                  <TrendingUp className="h-4 w-4" />
                  <span>Measurable outcomes</span>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Mentors Carousel / Grid */}
        <section
          id="mentors"
          className="py-20 bg-white border-y border-slate-200/70"
        >
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div>
                <Badge variant="accent" size="md">
                  Vetted Mentors
                </Badge>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Learn from leaders who've done it
                </h2>
                <p className="mt-2 text-base text-slate-600 max-w-xl">
                  Every mentor is individually verified for professional
                  expertise and commitment to mentorship.
                </p>
              </div>
              <Link to={ROUTES.REGISTER} className="mt-4 md:mt-0">
                <Button
                  variant="outline"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  View all 500+ mentors
                </Button>
              </Link>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {featuredMentors.map((mentor) => (
                <Card
                  key={mentor.name}
                  hoverable
                  className="flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <Avatar name={mentor.name} size="lg" status="online" />
                      <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200/60">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span>{mentor.rating}</span>
                        <span className="text-slate-400 font-normal">
                          ({mentor.reviewsCount})
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-900">
                      {mentor.name}
                    </h3>
                    <p className="text-xs font-semibold text-teal-700">
                      {mentor.role}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {mentor.experience}
                    </p>

                    <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      "{mentor.bio}"
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {mentor.skills.map((skill) => (
                        <Badge key={skill} variant="default" size="sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      1-on-1 Mentorship
                    </span>
                    <Link to={ROUTES.REGISTER}>
                      <Button variant="primary" size="sm">
                        Request Session
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Daleel Pillars */}
        <section id="why-daleel" className="py-20 bg-background">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="primary" size="md">
                The Daleel Difference
              </Badge>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Why professionals choose Daleel
              </h2>
              <p className="mt-3 text-base text-slate-600">
                A purpose-built platform designed specifically for long-term
                career impact.
              </p>
            </div>

            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">
                  Vetted Practitioners
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  We verify experience and interview mentors so you only learn
                  from true experts.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">
                  Direct & Practical
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Concrete feedback on your actual code, designs, presentations,
                  and resume.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">
                  Two-Way Growth
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Start as a mentee and grow into a mentor as your career
                  flourishes over time.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">
                  Safe Environment
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Ask candid questions you wouldn't feel comfortable raising
                  with your direct manager.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Big CTA Banner */}
        <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-teal-900 to-slate-950 px-8 py-14 text-white shadow-xl sm:px-16 md:py-20">
            {/* Ambient decorative shapes */}
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

            <div className="relative mx-auto max-w-2xl text-center">
              <span className="inline-block rounded-full bg-teal-500/20 px-3.5 py-1 text-xs font-semibold text-teal-300 ring-1 ring-teal-400/30">
                Begin Your Journey
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                Ready to find the right guide for your career?
              </h2>
              <p className="mt-4 text-base text-teal-100/90 leading-relaxed">
                Join thousands of software engineers, designers, and product
                managers leveling up through personalized 1-on-1 mentorship.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link to={`${ROUTES.REGISTER}?intent=mentee`}>
                  <Button
                    variant="accent"
                    size="lg"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Join Daleel for Free
                  </Button>
                </Link>
                <Link to={`${ROUTES.REGISTER}?intent=mentor`}>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-white hover:bg-white/10 hover:text-white"
                  >
                    Apply as a Mentor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <DaleelLogo size="md" showTagline />
              <p className="mt-4 max-w-sm text-xs text-slate-500 leading-relaxed">
                Daleel (دليل) connects driven professionals with vetted industry
                mentors across the Middle East and worldwide. Empowering
                careers, one session at a time.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Platform
              </h4>
              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                <li>
                  <Link
                    to={`${ROUTES.REGISTER}?intent=mentee`}
                    className="hover:text-teal-700"
                  >
                    Find Mentors
                  </Link>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-teal-700">
                    How it works
                  </a>
                </li>
                <li>
                  <Link
                    to={`${ROUTES.REGISTER}?intent=mentor`}
                    className="hover:text-teal-700"
                  >
                    Become a Mentor
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Account
              </h4>
              <ul className="mt-3 space-y-2 text-xs text-slate-600">
                <li>
                  <Link to={ROUTES.LOGIN} className="hover:text-teal-700">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.REGISTER} className="hover:text-teal-700">
                    Create account
                  </Link>
                </li>
                <li>
                  <Link
                    to={ROUTES.FORGOT_PASSWORD}
                    className="hover:text-teal-700"
                  >
                    Forgot password
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
            <p className="text-xs text-slate-400">
              © 2026 Daleel. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs text-slate-400">
              <a href="#" className="hover:text-slate-600">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-slate-600">
                Terms of Service
              </a>
              <a href="#" className="hover:text-slate-600">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
