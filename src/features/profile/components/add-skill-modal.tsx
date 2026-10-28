import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/button';
import { Modal } from '@/components/modal';
import { TextInput } from '@/components/text-input';
import { useToast } from '@/hooks/use-toast';
import {
  addSkillSchema,
  type AddSkillFormData,
} from '../schemas/profile.schemas';
import { useAddMentorSkill } from '../hooks/use-profile-topics';

export interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSkills: string[];
}

export function AddSkillModal({
  isOpen,
  onClose,
  currentSkills,
}: AddSkillModalProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const addSkillMutation = useAddMentorSkill();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddSkillFormData>({
    resolver: zodResolver(addSkillSchema),
    mode: 'onTouched',
    defaultValues: {
      skill: '',
    },
  });

  const handleClose = () => {
    reset();
    setErrorMsg(null);
    onClose();
  };

  const onSubmit = (data: AddSkillFormData) => {
    const trimmed = data.skill.trim();

    if (currentSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg('This skill is already listed in your mentor skills.');
      return;
    }

    setErrorMsg(null);

    addSkillMutation.mutate(
      { newSkill: trimmed, currentSkills },
      {
        onSuccess: () => {
          toast.success(`Added "${trimmed}" to your mentoring skills.`);
          handleClose();
        },
        onError: (err) => {
          const msg = err.message || 'Failed to add skill.';
          setErrorMsg(msg);
          toast.error(msg);
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Mentoring Skill"
      description="Add a skill, technology, or expertise domain you can mentor others in."
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        {errorMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        <TextInput
          label="Skill Name"
          required
          placeholder="e.g. Distributed Systems, Product Strategy"
          error={errors.skill?.message}
          {...register('skill')}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting || addSkillMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={isSubmitting || addSkillMutation.isPending}
          >
            Add Skill
          </Button>
        </div>
      </form>
    </Modal>
  );
}
