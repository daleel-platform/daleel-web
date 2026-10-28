import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Modal } from '@/components/modal';
import { TextInput } from '@/components/text-input';
import { useToast } from '@/hooks/use-toast';
import {
  mentorApplicationSchema,
  type MentorApplicationFormData,
} from '../schemas/profile.schemas';
import { useMentorApplication } from '../hooks/use-mentor-application';

export interface ApplyMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApplyMentorModal({ isOpen, onClose }: ApplyMentorModalProps) {
  const [skillInput, setSkillInput] = useState('');
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const applyMentorMutation = useMentorApplication();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MentorApplicationFormData>({
    resolver: zodResolver(mentorApplicationSchema),
    mode: 'onTouched',
    defaultValues: {
      headline: '',
      yearsOfExperience: 1,
      about: '',
      skills: [],
    },
  });

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    if (skillsList.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkillInput('');
      return;
    }

    const updated = [...skillsList, trimmed];
    setSkillsList(updated);
    setValue('skills', updated, { shouldValidate: true });
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = skillsList.filter((s) => s !== skillToRemove);
    setSkillsList(updated);
    setValue('skills', updated, { shouldValidate: true });
  };

  const handleClose = () => {
    reset();
    setSkillsList([]);
    setSkillInput('');
    setSubmitError(null);
    onClose();
  };

  const onSubmit = (data: MentorApplicationFormData) => {
    setSubmitError(null);

    applyMentorMutation.mutate(
      {
        headline: data.headline,
        yearsOfExperience: data.yearsOfExperience,
        about: data.about,
        skills: data.skills,
      },
      {
        onSuccess: () => {
          toast.success('Mentor application submitted successfully!');
          handleClose();
        },
        onError: (err) => {
          const msg = err.message || 'Failed to submit mentor application.';
          setSubmitError(msg);
          toast.error(msg);
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Become a Mentor"
      description="Share your expertise with the Daleel community. Fill in your professional details below."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {submitError}
          </div>
        )}

        <TextInput
          label="Professional Headline"
          required
          placeholder="e.g. Senior Software Engineer at TechCorp"
          error={errors.headline?.message}
          {...register('headline')}
        />

        <TextInput
          label="Years of Experience"
          required
          type="number"
          min={1}
          max={60}
          placeholder="e.g. 5 (minimum 1 year)"
          error={errors.yearsOfExperience?.message}
          {...register('yearsOfExperience', { valueAsNumber: true })}
        />

        {/* Mentoring Skills Selection - strictly separate from mentee interests */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>
              Mentoring Skills <span className="text-red-500">*</span>
            </span>
            <span className="text-[11px] font-normal text-slate-400">
              Only explicitly added skills are saved
            </span>
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="e.g. React, System Design, Career Growth"
              className="flex-1 rounded-xl border border-slate-300/90 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddSkill}
              leftIcon={<Plus className="h-3.5 w-3.5" />}
            >
              Add
            </Button>
          </div>

          {errors.skills?.message && (
            <p className="text-xs font-medium text-red-600">
              {errors.skills.message}
            </p>
          )}

          {skillsList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {skillsList.map((skill) => (
                <Badge
                  key={`new-mentor-skill-${skill}`}
                  variant="accent"
                  size="sm"
                  className="pr-1 py-0.5"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    aria-label={`Remove skill ${skill}`}
                    className="ml-1 rounded p-0.5 text-amber-800 hover:text-red-600 focus-visible:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="mentor-about"
            className="text-xs font-semibold text-slate-700"
          >
            About Me (Mentorship Bio) <span className="text-red-500">*</span>
          </label>
          <textarea
            id="mentor-about"
            rows={3}
            placeholder="Tell mentees about your experience, how you can help them, and what areas you specialize in..."
            className="w-full rounded-xl border border-slate-300/90 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 transition-all resize-none"
            {...register('about')}
          />
          {errors.about?.message && (
            <p className="text-xs font-medium text-red-600">
              {errors.about.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting || applyMentorMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={isSubmitting || applyMentorMutation.isPending}
          >
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
}
