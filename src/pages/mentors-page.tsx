import { useState } from 'react';
import { Link } from 'react-router';
import { Briefcase, Compass, Filter, Search, Star } from 'lucide-react';

import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Text } from '@/components/text';
import { ROUTES } from '@/routes/paths';

const categories = [
  'All Tracks',
  'Software Engineering',
  'Product Management',
  'UI/UX Design',
  'AI & Data Science',
  'Tech Leadership',
];

const mockMentors = [
  {
    id: '1',
    name: 'Sarah Mansour',
    role: 'Staff Software Engineer',
    company: 'Stripe',
    category: 'Software Engineering',
    experience: '11 years',
    rating: '5.0',
    reviewsCount: 38,
    rate: '$60/hr',
    bio: 'Helping engineers bridge the gap from Senior to Staff+ with structured system architecture and impact frameworks.',
    skills: ['System Design', 'Tech Leadership', 'Distributed Systems', 'Go'],
  },
  {
    id: '2',
    name: 'Omar Sherif',
    role: 'VP of Product',
    company: 'Careem',
    category: 'Product Management',
    experience: '14 years',
    rating: '4.9',
    reviewsCount: 52,
    rate: '$50/hr',
    bio: 'Former founder turned product leader. I coach PMs on roadmapping, stakeholder alignment, and executive communication.',
    skills: ['Product Strategy', 'Growth', 'Executive Presence', 'Metrics'],
  },
  {
    id: '3',
    name: 'Lina Haddad',
    role: 'Design Director',
    company: 'Instabug',
    category: 'UI/UX Design',
    experience: '9 years',
    rating: '4.95',
    reviewsCount: 29,
    rate: '$45/hr',
    bio: 'Passionate about crafting world-class digital experiences and mentoring designers to crack international product roles.',
    skills: ['Product Design', 'Design Systems', 'Portfolio Review', 'Figma'],
  },
  {
    id: '4',
    name: 'Khaled El-Sayed',
    role: 'Principal AI Researcher',
    company: 'Siemens Health',
    category: 'AI & Data Science',
    experience: '10 years',
    rating: '4.92',
    reviewsCount: 24,
    rate: '$70/hr',
    bio: 'Guiding machine learning engineers on production LLMs, CV architectures, and research-to-product roadmaps.',
    skills: ['LLMs', 'PyTorch', 'MLOps', 'Computer Vision'],
  },
  {
    id: '5',
    name: 'Yasmine Adel',
    role: 'Head of Engineering',
    company: 'Swvl',
    category: 'Tech Leadership',
    experience: '13 years',
    rating: '4.98',
    reviewsCount: 45,
    rate: '$65/hr',
    bio: 'Mentoring engineering managers on organizational scaling, team culture, retention, and strategic delivery.',
    skills: ['Engineering Management', 'Org Scaling', 'Culture', 'Agile'],
  },
  {
    id: '6',
    name: 'Tarek Fathy',
    role: 'Lead Cloud Architect',
    company: 'Vodafone',
    category: 'Software Engineering',
    experience: '8 years',
    rating: '4.88',
    reviewsCount: 19,
    rate: '$40/hr',
    bio: 'Helping backend developers master Kubernetes, AWS cloud architectures, and high-availability systems.',
    skills: ['AWS', 'Kubernetes', 'DevOps', 'Terraform'],
  },
];

export function MentorsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Tracks');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMentors = mockMentors.filter((mentor) => {
    const matchesCategory =
      selectedCategory === 'All Tracks' || mentor.category === selectedCategory;
    const matchesSearch =
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.skills.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:py-10 space-y-8">
      {/* Page Title & Description */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">
            <Compass className="h-3 w-3" />
            <span>500+ Verified Mentors</span>
          </Badge>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
          Discover Mentors
        </h1>
        <p className="mt-1 text-sm text-slate-500 max-w-2xl">
          Connect 1-on-1 with industry practitioners who have walked the path.
          Filter by domain, skill, or company to find the ideal guide for your
          next step.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mentors by name, role, company, or skills (e.g. System Design, Careem)..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-600/10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Filter className="h-3.5 w-3.5" />}
          >
            Filters
          </Button>
          <span className="text-xs text-slate-500">
            Showing{' '}
            <strong className="text-slate-800">{filteredMentors.length}</strong>{' '}
            mentors
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === category
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Mentors Grid */}
      {filteredMentors.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMentors.map((mentor) => (
            <Card
              key={mentor.id}
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

                <div className="mt-4">
                  <h3 className="text-base font-bold text-slate-900">
                    {mentor.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-teal-700 font-semibold mt-0.5">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>
                      {mentor.role} · {mentor.company}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {mentor.experience} professional experience
                  </p>
                </div>

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
                <div>
                  <span className="text-xs text-slate-400 block leading-none">
                    Starting from
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-1 block">
                    {mentor.rate}
                  </span>
                </div>
                <Link to={ROUTES.MENTOR_DETAILS(mentor.id)}>
                  <Button variant="primary" size="sm">
                    View Profile
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Search className="h-6 w-6" />
          </div>
          <Text variant="h3" className="mt-4">
            No mentors found
          </Text>
          <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or selecting a different career
            track above.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Tracks');
            }}
            className="mt-4"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
