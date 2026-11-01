import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const STORAGE_KEY = 'arithmusic-tutorial-dismissed';

interface Step {
  title: string;
  body: string;
}

const STEPS: Step[] = [
  {
    title: 'WELCOME',
    body: 'Arithmusic is a synthesizer where you compose music using math. Type frequency expressions like 440 + 100 * x and hear them come alive as sound waves.',
  },
  {
    title: 'THE LCD GRAPH',
    body: 'The large screen plots frequency over time for every track. Each track has its own line style — solid, dashed, dotted. When you hit Play, a playhead sweeps across so you can see exactly what\'s sounding.',
  },
  {
    title: 'TRACKS & TIMELINE',
    body: 'The bottom panel holds your tracks. Each track has a wave type (sine, triangle, saw) and a row of segment keys you can drag to reorder. Add tracks and segments with the + keys, or insert presets from Notes, Functions and Patterns.',
  },
  {
    title: 'SEGMENT EDITOR',
    body: 'Click any segment key to edit it on the right side of the screen. Set the frequency expression (e.g. 440 + 100 * x), length in seconds, and volume. The blue cursor pad or arrow keys step between segments.',
  },
  {
    title: 'PLAY & SAVE',
    body: 'Use the blue F-keys on the left to Play or Pause, and the red key to Stop. MODE opens settings like sample rate and volume. LOAD and SAVE handle compositions as JSON files.',
  },
];

export default function TutorialModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Auto-open on mount if not dismissed
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true);
    }
  }, []);

  // Listen for help button re-open event
  useEffect(() => {
    const handler = () => {
      setStep(0);
      setDontShowAgain(false);
      setOpen(true);
    };
    window.addEventListener('open-tutorial', handler);
    return () => window.removeEventListener('open-tutorial', handler);
  }, []);

  const handleClose = useCallback(() => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    setOpen(false);
  }, [dontShowAgain]);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display tracking-widest text-legend">
            {STEPS[step].title}
          </DialogTitle>
          <DialogDescription className="sr-only">Tutorial step {step + 1} of {STEPS.length}</DialogDescription>
        </DialogHeader>

        {/* LCD-style content panel */}
        <div className="lcd-screen p-5">
          <p className="relative text-base leading-relaxed">
            {STEPS[step].body}
          </p>
        </div>

        {/* Step indicator dots */}
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={
                i === step
                  ? 'h-1.5 w-6 rounded-full bg-legend transition-all'
                  : 'h-1.5 w-1.5 rounded-full bg-muted-foreground/50 transition-all'
              }
            />
          ))}
        </div>

        <DialogFooter className="flex-row items-center justify-between sm:justify-between">
          {/* Don't show again */}
          <div className="flex items-center gap-2">
            <Switch
              id="tutorial-dismiss"
              size="sm"
              checked={dontShowAgain}
              onCheckedChange={setDontShowAgain}
            />
            <Label htmlFor="tutorial-dismiss" className="text-xs uppercase tracking-wider text-muted-foreground">
              Don't show again
            </Label>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="calc-secondary" size="sm" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <>
                <Button variant="calc-secondary" size="sm" onClick={handleClose}>
                  Skip
                </Button>
                <Button variant="calc" size="sm" onClick={() => setStep(step + 1)}>
                  Next
                </Button>
              </>
            ) : (
              <Button variant="calc" size="sm" onClick={handleClose}>
                Get Started
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
