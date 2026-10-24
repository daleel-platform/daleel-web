import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, Edit, User, Settings, X } from 'lucide-react';

interface MentorProfile {
  id?: string;
  userId?: string;
  headline?: string;
  about?: string;
  skills?: string[];
  yearsOfExperience?: number | null;
  linkedinUrl?: string | null;
  isActive?: boolean;
}

interface UserProfileResponse {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  avatarUrl?: string | null;
  mentorProfile?: MentorProfile | null;
  topics?: string[];
  interests?: string[];
  data?: any;
}

const fetchUserProfile = async (): Promise<UserProfileResponse> => {
  let token = localStorage.getItem('daleel_auth_token');
  if (token) {
    token = token.replace(/^["']|["']$/g, '');
  }

  const response = await fetch('http://localhost:3000/api/v1/users/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`HTTP Error ${response.status}: ${errorData}`);
  }

  return await response.json();
};

const ProfilePage: React.FC = () => {
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);

  const [topicInput, setTopicInput] = useState('');
  const [editNameInput, setEditNameInput] = useState('');

  const [mentorHeadline, setMentorHeadline] = useState('');
  const [mentorExperience, setMentorExperience] = useState<number | ''>('');
  const [mentorAbout, setMentorAbout] = useState('');
  const [mentorSkillsInput, setMentorSkillsInput] = useState('');

  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery<UserProfileResponse>({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });

  const userData = userProfile?.data || userProfile || {};

  const hasMentorProfile = Boolean(userData.mentorProfile);
  const isMentor = userData.mentorProfile?.isActive ?? false;

  const currentSkills: string[] = hasMentorProfile
    ? (userData.mentorProfile?.skills ?? [])
    : (userData.interests ?? []);

  const fullName =
    userData.name ||
    `${userData.firstName || ''} ${userData.lastName || ''}`.trim();

  useEffect(() => {
    if (fullName) {
      setEditNameInput(fullName);
    }
  }, [fullName]);

  const editProfileMutation = useMutation({
    mutationFn: async (newName: string) => {
      let token = localStorage.getItem('daleel_auth_token');
      if (token) {
        token = token.replace(/^["']|["']$/g, '');
      }

      const response = await fetch('http://localhost:3000/api/v1/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          name: newName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }
      return response.json();
    },
    onSuccess: () => {
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error: Error) => {
      alert(`Update failed: ${error.message}`);
    },
  });

  const addTopicMutation = useMutation({
    mutationFn: async (newTopic: string) => {
      const updatedTopics = [...currentSkills, newTopic];

      let token = localStorage.getItem('daleel_auth_token');
      if (token) {
        token = token.replace(/^["']|["']$/g, '');
      }

      const endpoint = hasMentorProfile
        ? 'http://localhost:3000/api/v1/mentors/me'
        : 'http://localhost:3000/api/v1/users/me';

      const body = hasMentorProfile
        ? { skills: updatedTopics }
        : { interests: updatedTopics };

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      return response.json();
    },

    onSuccess: () => {
      setIsTopicModalOpen(false);
      setTopicInput('');
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },

    onError: (error: Error) => {
      alert(`Add failed: ${error.message}`);
    },
  });

  const removeTopicMutation = useMutation({
    mutationFn: async (topicToRemove: string) => {
      const updatedTopics = currentSkills.filter(
        (topic) => topic !== topicToRemove,
      );

      let token = localStorage.getItem('daleel_auth_token');
      if (token) {
        token = token.replace(/^["']|["']$/g, '');
      }

      const endpoint = hasMentorProfile
        ? 'http://localhost:3000/api/v1/mentors/me'
        : 'http://localhost:3000/api/v1/users/me';

      const body = hasMentorProfile
        ? { skills: updatedTopics }
        : { interests: updatedTopics };

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      return response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },

    onError: (error: Error) => {
      alert(`Delete failed: ${error.message}`);
    },
  });

  const applyMentorMutation = useMutation({
    mutationFn: async (mentorData: {
      headline: string;
      yearsOfExperience: number;
      about: string;
      skills: string[];
    }) => {
      let token = localStorage.getItem('daleel_auth_token');
      if (token) {
        token = token.replace(/^["']|["']$/g, '');
      }

      const response = await fetch('http://localhost:3000/api/v1/mentors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(mentorData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }
      return response.json();
    },
    onSuccess: () => {
      setIsMentorModalOpen(false);
      setMentorHeadline('');
      setMentorExperience('');
      setMentorAbout('');
      setMentorSkillsInput('');
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error: Error) => {
      alert(`Application failed: ${error.message}`);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600 font-semibold">
        Failed to load profile data.
      </div>
    );
  }

  const userEmail = userData.email || '';
  const userAvatar = userData.avatarUrl || null;
  const headline =
    userData.mentorProfile?.headline ||
    'Passionate learner actively exploring new skills and growing through Daleel community.';
  const initials = fullName
    ? fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'U';

  const addedSkills = mentorSkillsInput
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const combinedMentorSkills = Array.from(
    new Set([...currentSkills, ...addedSkills]),
  );
  const hasEnoughSkillsForMentor = combinedMentorSkills.length > 0;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={fullName}
                className="w-24 h-24 rounded-full object-cover border-2 border-teal-100"
              />
            ) : (
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-teal-800 text-white flex items-center justify-center text-3xl font-bold">
                  {initials}
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-teal-500 border-4 border-white rounded-full"></div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-extrabold text-gray-900">
                  {fullName}
                </h1>
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md ${isMentor ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-700'}`}
                >
                  {isMentor ? 'Active Mentor' : 'Active Mentee'}
                </span>
              </div>
              <p className="text-gray-500 text-sm flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4" /> {userEmail}
              </p>
              <p className="text-gray-700 text-sm max-w-lg leading-relaxed">
                {headline}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" /> Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col h-full">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" /> Personal Information
            </h2>

            <div className="space-y-5 flex-1">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <p className="text-gray-800 font-medium">{fullName}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <p className="text-gray-800 font-medium">{userEmail}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  Account Type
                </label>
                <p className="text-teal-700 font-semibold">
                  {isMentor
                    ? 'Mentor'
                    : 'Standard Member (Mentee & Potential Mentor)'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-400" />{' '}
                {hasMentorProfile
                  ? 'Mentoring Skills'
                  : 'Topics I Want to Learn'}
              </h2>
              <button
                onClick={() => setIsTopicModalOpen(true)}
                className="text-sm font-semibold text-teal-700 hover:text-teal-800"
              >
                Add Topic
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              {hasMentorProfile
                ? 'These are the domains you are offering mentorship in based on your profile.'
                : "These topics guide Daleel's recommendation engine when suggesting mentors for you."}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
              {currentSkills.length > 0 ? (
                currentSkills.map((topic: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-white border border-teal-100 text-teal-700 text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    {topic}
                    <button
                      onClick={() => removeTopicMutation.mutate(topic)}
                      disabled={
                        removeTopicMutation.isPending ||
                        (hasMentorProfile && currentSkills.length === 1)
                      }
                      className={`ml-1 focus:outline-none transition-colors ${
                        hasMentorProfile && currentSkills.length === 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-teal-500 hover:text-red-500'
                      }`}
                      title={
                        hasMentorProfile && currentSkills.length === 1
                          ? 'A mentor must have at least one skill'
                          : 'Remove'
                      }
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-400 italic">
                  No topics added yet.
                </span>
              )}
            </div>
          </div>
        </div>

        {!hasMentorProfile && (
          <div className="bg-white rounded-2xl p-8 border border-teal-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-teal-600"></div>
            <div>
              <p className="text-amber-600 text-sm font-bold flex items-center gap-1 mb-1">
                Ready to Share Your Knowledge?
              </p>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Activate Your Mentor Profile
              </h2>
              <p className="text-gray-500 text-sm max-w-xl">
                Create your mentor offerings, set your hourly rate or offer free
                community sessions, and start guiding the next generation.
              </p>
            </div>
            <button
              onClick={() => setIsMentorModalOpen(true)}
              className="px-6 py-3 bg-teal-800 text-white font-semibold rounded-xl hover:bg-teal-900 transition-colors whitespace-nowrap"
            >
              Apply to Become a Mentor
            </button>
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditNameInput(fullName);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editNameInput}
                  onChange={(e) => setEditNameInput(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button
                onClick={() => editProfileMutation.mutate(editNameInput)}
                disabled={
                  editProfileMutation.isPending || !editNameInput.trim()
                }
                className={`w-full mt-4 text-white font-semibold rounded-xl py-3 transition-colors ${
                  editProfileMutation.isPending || !editNameInput.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-teal-800 hover:bg-teal-900'
                }`}
              >
                {editProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isTopicModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Topic</h3>
              <button
                onClick={() => {
                  setIsTopicModalOpen(false);
                  setTopicInput('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. System Design"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button
                onClick={() => addTopicMutation.mutate(topicInput)}
                disabled={addTopicMutation.isPending || !topicInput.trim()}
                className={`w-full mt-4 text-white font-semibold rounded-xl py-3 transition-colors ${
                  addTopicMutation.isPending || !topicInput.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-teal-800 hover:bg-teal-900'
                }`}
              >
                {addTopicMutation.isPending ? 'Adding...' : 'Add Topic'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isMentorModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Become a Mentor
              </h3>
              <button
                onClick={() => setIsMentorModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Please fill out your mentor details to start guiding others.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Professional Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Software Engineer"
                  value={mentorHeadline}
                  onChange={(e) => setMentorHeadline(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={mentorExperience}
                  onChange={(e) =>
                    setMentorExperience(
                      e.target.value ? Number(e.target.value) : '',
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Top Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, Mentorship"
                  value={mentorSkillsInput}
                  onChange={(e) => setMentorSkillsInput(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  About Me
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell mentees about your background..."
                  value={mentorAbout}
                  onChange={(e) => setMentorAbout(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <button
                onClick={() =>
                  applyMentorMutation.mutate({
                    headline: mentorHeadline,
                    yearsOfExperience: Number(mentorExperience),
                    about: mentorAbout || 'Ready to share my knowledge.',
                    skills: combinedMentorSkills,
                  })
                }
                disabled={
                  applyMentorMutation.isPending ||
                  !mentorHeadline.trim() ||
                  mentorExperience === '' ||
                  !hasEnoughSkillsForMentor
                }
                className={`w-full mt-4 text-white font-semibold rounded-xl py-3 transition-colors ${
                  applyMentorMutation.isPending ||
                  !mentorHeadline.trim() ||
                  mentorExperience === '' ||
                  !hasEnoughSkillsForMentor
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-teal-800 hover:bg-teal-900'
                }`}
              >
                {applyMentorMutation.isPending
                  ? 'Submitting...'
                  : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ProfilePage };
export default ProfilePage;
