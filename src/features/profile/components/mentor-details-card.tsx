import { Briefcase, Plus, Sparkles, X } from 'lucide-react';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import type { MentorProfile } from '../types/profile.types';
import { getMentorStatus } from '@/types/mentor';
import { useRemoveMentorSkill } from '../hooks/use-profile-topics';
import { useToast } from '@/hooks/use-toast';

export interface MentorDetailsCardProps {
  mentorProfile: MentorProfile;
  onAddSkillClick: () => void;
}

export function MentorDetailsCard({
  mentorProfile,
  onAddSkillClick,
}: MentorDetailsCardProps) {
  const mentorStatus = getMentorStatus(mentorProfile);
  const removeSkillMutation = useRemoveMentorSkill();
  const toast = useToast();

  const skills = mentorProfile.skills ?? [];

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
    <Card className="flex flex-col p-6 sm:p-8 space-y-6 border-teal-100 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-teal-700" />
          <h2 className="text-base font-bold text-slate-900">
            Mentor Profile Details
          </h2>
        </div>

        {mentorStatus === 'ACTIVE' && (
          <Badge variant="accent" size="sm" className="gap-1">
            <Sparkles className="h-3 w-3 text-amber-600" />
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Professional Headline
          </label>
          <p className="text-xs font-semibold text-slate-800">
            {mentorProfile.headline}
          </p>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Years of Experience
          </label>
          <p className="text-xs font-semibold text-slate-800">
            {mentorProfile.yearsOfExperience}{' '}
            {mentorProfile.yearsOfExperience === 1 ? 'Year' : 'Years'}
          </p>
        </div>
      </div>

      <div>
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          About Mentor
        </label>
        <p className="text-xs text-slate-600 leading-relaxed">
          {mentorProfile.about || (
            <span className="italic text-slate-400">
              No description provided.
            </span>
          )}
        </p>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Mentoring Skills
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              These are the domains you are offering mentorship in based on your
              profile.
            </p>
          </div>

          <Button
            variant="outline"
            size="xs"
            onClick={onAddSkillClick}
            leftIcon={<Plus className="h-3 w-3" />}
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
                  className="ml-1 rounded-sm p-0.5 text-amber-800 hover:bg-amber-200/80 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-700 transition-colors"
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
