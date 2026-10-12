import { useState } from 'react';
import { Link } from 'react-router';
import {
  Calendar,
  Clock,
  Compass,
  FileText,
  MessageSquare,
  Star,
  Video,
} from 'lucide-react';

import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ROUTES } from '@/routes/paths';

export function SessionsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>(
    'upcoming',
  );

  const upcomingSessions = [
    {
      id: 'session-1',
      topic: 'Product Management Career Roadmap & IC-to-Lead Transition',
      mentorName: 'Ahmed Nasser',
      mentorRole: 'Senior Staff PM at Careem',
      date: 'Thursday, Oct 15',
      time: '4:00 PM – 4:45 PM GMT+3',
      status: 'confirmed',
      notes:
        'Prepare 3 questions on roadmapping frameworks and stakeholder negotiation.',
    },
  ];

  const pastSessions = [
    {
      id: 'session-old-1',
      topic: 'System Design Mock: Designing a Global Payment Ledger',
      mentorName: 'Sarah Mansour',
      mentorRole: 'Staff Software Engineer at Stripe',
      date: 'Sep 28, 2026',
      time: '6:00 PM (60 mins)',
      ratingGiven: 5,
      hasNotes: true,
    },
    {
      id: 'session-old-2',
      topic: 'Design Systems Architecture & Figma Tokens Review',
      mentorName: 'Lina Haddad',
      mentorRole: 'Design Director at Instabug',
      date: 'Sep 12, 2026',
      time: '5:00 PM (45 mins)',
      ratingGiven: 5,
      hasNotes: true,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            My Mentorship Sessions
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your scheduled calls, access meeting rooms, and review notes
            from past discussions.
          </p>
        </div>

        <Link to={ROUTES.MENTORS}>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Compass className="h-4 w-4" />}
          >
            Book New Session
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
            activeTab === 'upcoming'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Upcoming ({upcomingSessions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
            activeTab === 'completed'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Completed ({pastSessions.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'upcoming' ? (
        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <Card
              key={session.id}
              className="border-teal-200/90 bg-gradient-to-br from-teal-50/30 via-white to-white p-6 shadow-xs"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <Avatar name={session.mentorName} size="lg" status="online" />
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success" size="sm">
                        Confirmed
                      </Badge>
                      <span className="text-xs text-slate-400">
                        1-on-1 Video Call
                      </span>
                    </div>
                    <h3 className="mt-1 text-base font-bold text-slate-900">
                      {session.topic}
                    </h3>
                    <p className="text-xs font-semibold text-teal-700 mt-0.5">
                      with {session.mentorName} ({session.mentorRole})
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-teal-700" />
                        {session.date}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="h-3.5 w-3.5 text-teal-700" />
                        {session.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-slate-100 lg:border-t-0 lg:pt-0">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Video className="h-4 w-4" />}
                  >
                    Join Video Room
                  </Button>
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  <Link to={ROUTES.MESSAGES}>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<MessageSquare className="h-4 w-4" />}
                    >
                      Message
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {pastSessions.map((session) => (
            <Card key={session.id} className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Avatar name={session.mentorName} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default" size="sm">
                        Completed
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {session.date}
                      </span>
                    </div>
                    <h3 className="mt-1 text-sm font-bold text-slate-900">
                      {session.topic}
                    </h3>
                    <p className="text-xs text-slate-500">
                      with {session.mentorName} ({session.mentorRole})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<FileText className="h-3.5 w-3.5" />}
                  >
                    View Notes
                  </Button>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold px-2 py-1 bg-amber-50 rounded-lg">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>Rated {session.ratingGiven}/5</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
