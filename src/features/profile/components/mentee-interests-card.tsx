import { BookOpen, Plus, X } from 'lucide-react';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { useRemoveMenteeInterest } from '../hooks/use-profile-topics';
import { useToast } from '@/hooks/use-toast';

export interface MenteeInterestsCardProps {
  interests: string[];
  onAddTopicClick: () => void;
}

export function MenteeInterestsCard({
  interests,
  onAddTopicClick,
}: MenteeInterestsCardProps) {
  const removeTopicMutation = useRemoveMenteeInterest();
  const toast = useToast();

  const handleRemove = (topicToRemove: string) => {
    removeTopicMutation.mutate(
      { interestToRemove: topicToRemove, currentInterests: interests },
      {
        onSuccess: () => {
          toast.success(`Removed "${topicToRemove}" from learning topics.`);
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to remove topic.');
        },
      },
    );
  };

  return (
    <Card className="flex flex-col h-full p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3 mb-2 pb-3 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-teal-600" />
          <span>Topics I Want to Learn</span>
        </h2>
        <Button
          variant="outline"
          size="xs"
          onClick={onAddTopicClick}
          leftIcon={<Plus className="h-3 w-3" />}
        >
          Add Topic
        </Button>
      </div>

      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
        These topics guide Daleel&apos;s recommendation engine when suggesting
        mentors for you.
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {interests.length > 0 ? (
          interests.map((topic) => (
            <Badge
              key={`mentee-interest-${topic}`}
              variant="primary"
              size="md"
              className="group pr-1.5 py-1"
            >
              <span>{topic}</span>
              <button
                type="button"
                onClick={() => handleRemove(topic)}
                disabled={removeTopicMutation.isPending}
                aria-label={`Remove ${topic}`}
                className="ml-1 rounded-sm p-0.5 text-teal-600 hover:bg-teal-100 hover:text-red-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-700 transition-colors"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </Badge>
          ))
        ) : (
          <div className="py-4 text-center w-full">
            <p className="text-xs text-slate-400 italic">
              No learning topics added yet.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
