import { useState, type FormEvent } from 'react';
import {
  Briefcase,
  Check,
  ExternalLink,
  Pencil,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { TextInput } from '@/components/text-input';
import { useToast } from '@/hooks/use-toast';
import { getMentorStatus } from '@/types/mentor';
import { useEditProfile } from '../hooks/use-edit-profile';
import { useRemoveMentorSkill } from '../hooks/use-profile-topics';
import type { MentorProfile } from '../types/profile.types';

export interface MentorDetailsCardProps {
  mentorProfile: MentorProfile;
  onAddSkillClick: () => void;
}

export function MentorDetailsCard({
  mentorProfile,
  onAddSkillClick,
}: MentorDetailsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [headline, setHeadline] = useState(mentorProfile.headline);
  const [yearsOfExperience, setYearsOfExperience] = useState(
    String(mentorProfile.yearsOfExperience ?? ''),
  );
  const [about, setAbout] = useState(mentorProfile.about ?? '');
  const [linkedinUrl, setLinkedinUrl] = useState(
    mentorProfile.linkedinUrl ?? '',
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const mentorStatus = getMentorStatus(mentorProfile);
  const editProfileMutation = useEditProfile();
  const removeSkillMutation = useRemoveMentorSkill();
  const toast = useToast();

  const skills = mentorProfile.skills ?? [];

  const handleStartEdit = () => {
    setHeadline(mentorProfile.headline);
    setYearsOfExperience(String(mentorProfile.yearsOfExperience ?? ''));
    setAbout(mentorProfile.about ?? '');
    setLinkedinUrl(mentorProfile.linkedinUrl ?? '');
    setValidationError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setValidationError(null);
    setIsEditing(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedHeadline = headline.trim();
    const trimmedAbout = about.trim();
    const trimmedLinkedin = linkedinUrl.trim();
    const parsedYears = Number(yearsOfExperience);

    if (trimmedHeadline.length < 3 || trimmedHeadline.length > 150) {
      setValidationError('Headline must be between 3 and 150 characters.');
      return;
    }

    if (
      !yearsOfExperience.trim() ||
      Number.isNaN(parsedYears) ||
      parsedYears < 1 ||
      parsedYears > 60
    ) {
      setValidationError('Years of experience must be between 1 and 60.');
      return;
    }

    if (trimmedAbout.length < 10 || trimmedAbout.length > 1000) {
      setValidationError(
        'About mentor description must be between 10 and 1000 characters.',
      );
      return;
    }

    setValidationError(null);
    editProfileMutation.mutate(
      {
        mentor: {
          headline: trimmedHeadline,
          yearsOfExperience: parsedYears,
          about: trimmedAbout,
          linkedinUrl: trimmedLinkedin || null,
        },
      },
      {
        onSuccess: () => {
          toast.success('Mentor profile updated.');
          setIsEditing(false);
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to update mentor profile.');
        },
      },
    );
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (skills.length <= 1) {
      toast.error('A mentor must have at least one skill.');
      return;
    }

    removeSkillMutation.mutate(
      { skillToRemove, currentSkills: skills },
      {
        onSuccess: () => {
          toast.success(`Removed "${skillToRemove}" from mentoring skills.`);
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to remove skill.');
        },
      },
    );
  };

  return (
    <Card className="flex flex-col p-6 space-y-6 border-teal-100 shadow-xs">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-teal-700" aria-hidden="true" />
          <h2 className="text-base font-bold text-slate-900">
            Mentor Profile Details
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {mentorStatus === 'ACTIVE' && (
            <Badge variant="accent" size="sm" className="gap-1">
              <Sparkles className="h-3 w-3 text-amber-600" aria-hidden="true" />
              <span>Active</span>
            </Badge>
          )}

          {mentorStatus === 'PENDING' && (
            <Badge variant="warning" size="sm">
              Pending Approval
            </Badge>
          )}

          {mentorStatus === 'INACTIVE' && (
            <Badge variant="default" size="sm">
              Inactive
            </Badge>
          )}

          {!isEditing && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleStartEdit}
              leftIcon={<Pencil className="h-3 w-3" aria-hidden="true" />}
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <TextInput
                id="mentor-inline-headline"
                label="Professional Headline"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                maxLength={150}
              />
            </div>
            <div className="sm:col-span-4">
              <TextInput
                id="mentor-inline-years"
                label="Years of Experience"
                type="number"
                min={1}
                max={60}
                required
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="mentor-inline-about"
                className="text-xs font-semibold text-slate-700"
              >
                About Mentor
              </label>
              <span className="text-[11px] font-medium text-slate-400">
                {about.length}/1000
              </span>
            </div>
            <textarea
              id="mentor-inline-about"
              rows={4}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              maxLength={1000}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/10 transition-all resize-none leading-relaxed"
            />
          </div>

          <TextInput
            id="mentor-inline-linkedin"
            label="LinkedIn Profile (Optional)"
            type="url"
            placeholder="https://www.linkedin.com/in/your-name"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
          />

          {validationError && (
            <p
              role="alert"
              className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl p-2.5"
            >
              {validationError}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleCancel}
              disabled={editProfileMutation.isPending}
              leftIcon={<X className="h-3 w-3" aria-hidden="true" />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="xs"
              loading={editProfileMutation.isPending}
              leftIcon={<Check className="h-3 w-3" aria-hidden="true" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      ) : (
        <dl className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Professional Headline
              </dt>
              <dd className="text-xs font-semibold text-slate-800">
                {mentorProfile.headline}
              </dd>
            </div>

            <div>
              <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Years of Experience
              </dt>
              <dd className="text-xs font-semibold text-slate-800">
                {mentorProfile.yearsOfExperience}{' '}
                {mentorProfile.yearsOfExperience === 1 ? 'Year' : 'Years'}
              </dd>
            </div>
          </div>

          <div>
            <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              About Mentor
            </dt>
            <dd className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {mentorProfile.about || (
                <span className="italic text-slate-400">
                  No description provided.
                </span>
              )}
            </dd>
          </div>

          {mentorProfile.linkedinUrl && (
            <div>
              <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                LinkedIn Profile
              </dt>
              <dd>
                <a
                  href={mentorProfile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline"
                >
                  <span>{mentorProfile.linkedinUrl}</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </dd>
            </div>
          )}
        </dl>
      )}

      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Mentoring Skills
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              These are the domains you offer mentorship in on your public
              profile.
            </p>
          </div>

          <Button
            variant="outline"
            size="xs"
            onClick={onAddSkillClick}
            leftIcon={<Plus className="h-3 w-3" aria-hidden="true" />}
          >
            Add Skill
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 pt-3">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <Badge
                key={`mentor-skill-${skill}`}
                variant="accent"
                size="md"
                className="group pr-1.5 py-1"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  disabled={skills.length <= 1 || removeSkillMutation.isPending}
                  aria-label={`Remove ${skill}`}
                  title={
                    skills.length <= 1
                      ? 'A mentor must have at least one skill'
                      : `Remove ${skill}`
                  }
                  className="ml-1 rounded-sm p-0.5 text-amber-800 hover:bg-amber-200/80 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-700 transition-colors cursor-pointer"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </Badge>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">
              No mentoring skills added yet.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
