import { useParams, Link } from 'react-router';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Star,
  Video,
} from 'lucide-react';

import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ROUTES } from '@/routes/paths';

export function MentorDetailsPage() {
  const { id } = useParams<{ id: string }>();

  // Fallback demo mentor based on ID or default to Sarah
  const mentor = {
    name: id === '2' ? 'Omar Sherif' : 'Sarah Mansour',
    role: id === '2' ? 'VP of Product' : 'Staff Software Engineer',
    company: id === '2' ? 'Careem' : 'Stripe',
    location: 'Dubai / Cairo (Remote Available)',
    rating: '5.0',
    reviewsCount: 38,
    rate: '$60/hr',
    bio: 'Senior technology leader with over a decade of hands-on experience designing distributed architectures and coaching engineers through critical career milestones.',
    about:
      'My mentorship is focused, practical, and tailored to your actual day-to-day challenges. Having transitioned from junior engineer to Staff level at hyper-growth tech companies, I help mentees develop deep technical leadership, master system design interviews, and communicate effectively with executives.',
    skills: [
      'System Design',
      'Tech Leadership',
      'Distributed Systems',
      'Go',
      'Career Strategy',
      'Promotion Roadmapping',
    ],
    offerings: [
      {
        title: 'Career & Promotion Strategy',
        duration: '45 mins',
        price: '$45',
        description:
          'Clarify your career roadmap, analyze your current promotion criteria, and create a concrete quarterly action plan.',
      },
      {
        title: 'System Design Mock Interview',
        duration: '60 mins',
        price: '$60',
        description:
          'Simulated whiteboard architecture session with real-time feedback on scale, bottlenecks, trade-offs, and communication.',
      },
      {
        title: 'Architecture & Code Review',
        duration: '45 mins',
        price: '$45',
        description:
          'Review real technical documents (RFCs, design docs, or repository structure) with targeted suggestions for robustness.',
      },
    ],
    reviews: [
      {
        author: 'Karim Soliman',
        role: 'Senior Backend Engineer',
        date: '2 weeks ago',
        rating: 5,
        content:
          'Sarah gave me the exact mental model I needed to redesign our payment reconciliation service. Her practical advice helped me nail my Staff evaluation.',
      },
      {
        author: 'Nourhan Magdy',
        role: 'Tech Lead',
        date: '1 month ago',
        rating: 5,
        content:
          'Incredible session! Extremely structured, encouraging, and full of real-world insights from Stripe that you won’t find in blog posts.',
      },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to={ROUTES.MENTORS}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Mentors Directory</span>
        </Link>
      </div>

      {/* Main Grid: Profile Info & Booking Sidebar */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left 8 Cols: Mentor Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Card */}
          <section className="rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">
              <Avatar
                name={mentor.name}
                size="xl"
                status="online"
                className="h-24 w-24 ring-4 ring-teal-50"
              />

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    {mentor.name}
                  </h1>
                  <Badge variant="success" size="sm">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Verified Mentor</span>
                  </Badge>
                </div>

                <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-teal-700">
                  <Briefcase className="h-4 w-4" />
                  <span>
                    {mentor.role} at {mentor.company}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {mentor.location}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{mentor.rating}</span>
                    <span className="text-slate-400 font-normal">
                      ({mentor.reviewsCount} reviews)
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-600 leading-relaxed">
                  {mentor.bio}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {mentor.skills.map((skill) => (
                    <Badge key={skill} variant="default" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* About My Mentorship Section */}
          <section className="rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900">
              About My Mentorship
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              {mentor.about}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-4">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                  How Sessions Work
                </span>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Conducted 1-on-1 via private Google Meet or Zoom. You receive
                  a recording and shared session notes with action items.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  Preparation
                </span>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Submit 2-3 specific questions or architecture diagrams ahead
                  of time to maximize our time together.
                </p>
              </div>
            </div>
          </section>

          {/* Mentorship Offerings */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              Mentorship Offerings
            </h2>
            <div className="space-y-3">
              {mentor.offerings.map((offering) => (
                <Card
                  key={offering.title}
                  className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        {offering.title}
                      </h3>
                      <Badge variant="primary" size="sm">
                        {offering.duration}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
                      {offering.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-extrabold text-slate-900">
                      {offering.price}
                    </span>
                    <Button variant="primary" size="sm">
                      Select
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Mentee Reviews */}
          <section className="rounded-3xl border border-slate-200/90 bg-white p-6 md:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Mentee Reviews ({mentor.reviews.length})
              </h2>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                <Star className="h-4 w-4 fill-current" />
                <span>{mentor.rating} out of 5</span>
              </div>
            </div>

            <div className="mt-6 space-y-6 divide-y divide-slate-100">
              {mentor.reviews.map((review) => (
                <div key={review.author} className="pt-6 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={review.author} size="sm" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {review.author}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {review.role}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {review.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "{review.content}"
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right 4 Cols: Sticky Booking Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-20 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md shadow-slate-200/50 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
                  Session Rate
                </span>
                <span className="text-2xl font-extrabold text-slate-900">
                  {mentor.rate}
                </span>
              </div>
              <Badge variant="primary" size="sm">
                Instant Confirmation
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <Clock className="h-4 w-4 text-teal-700" />
                <span>45-60 min 1-on-1 video call</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <Video className="h-4 w-4 text-teal-700" />
                <span>Google Meet link generated automatically</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <CheckCircle2 className="h-4 w-4 text-teal-700" />
                <span>100% Satisfaction Guarantee</span>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-center">
              <Calendar className="h-5 w-5 text-teal-700 mx-auto" />
              <p className="text-xs font-bold text-slate-800 mt-2">
                Available Tomorrow, 4:00 PM
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cairo Time (GMT+3)
              </p>
            </div>

            <Button variant="primary" size="lg" className="w-full">
              Request Mentorship Session
            </Button>

            <Link to={ROUTES.MESSAGES} className="block">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                leftIcon={<MessageSquare className="h-4 w-4" />}
              >
                Send Message First
              </Button>
            </Link>

            <p className="text-center text-[11px] text-slate-400 leading-normal">
              You won't be charged until the session is confirmed by the mentor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
