import { Sparkles } from 'lucide-react';
import { Button } from '@/components/button';
import { Card } from '@/components/card';

export interface MentorActivationBannerProps {
  onApplyClick: () => void;
}

export function MentorActivationBanner({
  onApplyClick,
}: MentorActivationBannerProps) {
  return (
    <Card className="rounded-3xl border border-teal-200/80 bg-gradient-to-r from-teal-50 via-teal-50/40 to-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-xs relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-600" />

      <div className="space-y-1.5 pl-2 sm:pl-0">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Ready to Share Your Knowledge?</span>
        </div>
        <h2 className="text-base font-bold text-slate-900">
          Activate Your Mentor Profile
        </h2>
        <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
          Create your mentor offerings, set your hourly rate or offer free
          community sessions, and start guiding the next generation.
        </p>
      </div>

      <div className="shrink-0 pl-2 sm:pl-0">
        <Button
          variant="primary"
          size="md"
          onClick={onApplyClick}
          className="w-full sm:w-auto whitespace-nowrap"
        >
          Apply to Become a Mentor
        </Button>
      </div>
    </Card>
  );
}
