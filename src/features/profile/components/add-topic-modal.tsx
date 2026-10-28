import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/button';
import { Modal } from '@/components/modal';
import { TextInput } from '@/components/text-input';
import { useToast } from '@/hooks/use-toast';
import {
  addTopicSchema,
  type AddTopicFormData,
} from '../schemas/profile.schemas';
import { useAddMenteeInterest } from '../hooks/use-profile-topics';

export interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInterests: string[];
}

export function AddTopicModal({
  isOpen,
  onClose,
  currentInterests,
}: AddTopicModalProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const addTopicMutation = useAddMenteeInterest();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddTopicFormData>({
    resolver: zodResolver(addTopicSchema),
    mode: 'onTouched',
    defaultValues: {
      topic: '',
    },
  });

  const handleClose = () => {
    reset();
    setErrorMsg(null);
    onClose();
  };

  const onSubmit = (data: AddTopicFormData) => {
    const trimmed = data.topic.trim();

    if (
      currentInterests.some((t) => t.toLowerCase() === trimmed.toLowerCase())
    ) {
      setErrorMsg('This topic is already in your learning list.');
      return;
    }

    setErrorMsg(null);

    addTopicMutation.mutate(
      { newInterest: trimmed, currentInterests },
      {
        onSuccess: () => {
          toast.success(`Added "${trimmed}" to your learning topics.`);
          handleClose();
        },
        onError: (err) => {
          const msg = err.message || 'Failed to add topic.';
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
      title="Add Learning Topic"
      description="Add a subject, tool, or domain you want to learn from mentors."
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        {errorMsg && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        <TextInput
          label="Topic Name"
          required
          placeholder="e.g. System Design, Python, Docker"
          error={errors.topic?.message}
          {...register('topic')}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting || addTopicMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={isSubmitting || addTopicMutation.isPending}
          >
            Add Topic
          </Button>
        </div>
      </form>
    </Modal>
  );
}
