import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FormField } from '@/components/ui/form-field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useComposition } from '../../context/CompositionContext';

export default function SettingsModal() {
  const { state, dispatch } = useComposition();
  const { fs, volume, multiplier, graphRange, aliasing } = state.settings;

  return (
    <Dialog open={state.showingModals.settings} onOpenChange={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'settings' })}>
      <DialogContent showCloseButton={false} className="sm:max-w-xl">
        <div className="flex flex-row gap-6">
          <div className="flex flex-1 flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription className="sr-only">Configure synthesis settings</DialogDescription>
            </DialogHeader>
            <FormField
              label="Master volume (%)"
              value={volume.value}
              error={volume.error}
              onChange={(e) => dispatch({ type: 'SETTINGS_CHANGE', field: 'volume', value: e.target.value })}
              wrapperClassName="w-36"
            />
            <FormField
              label="Auto multiplier for function input (x)"
              value={multiplier.value}
              error={multiplier.error}
              onChange={(e) => dispatch({ type: 'SETTINGS_CHANGE', field: 'multiplier', value: e.target.value })}
              wrapperClassName="w-64"
            />
            <FormField
              label="Upper graph range (Hz)"
              value={graphRange.value}
              error={graphRange.error}
              onChange={(e) => dispatch({ type: 'SETTINGS_CHANGE', field: 'graphRange', value: e.target.value })}
              wrapperClassName="w-44"
            />
            <FormField
              label="Sampling frequency (Hz)"
              value={fs.value}
              error={fs.error}
              onChange={(e) => dispatch({ type: 'SETTINGS_CHANGE', field: 'fs', value: e.target.value })}
              wrapperClassName="w-48"
            />
            <div className="flex items-center gap-3">
              <Label htmlFor="aliasing" className="text-sm uppercase tracking-wider text-muted-foreground">Enable Aliasing</Label>
              <Switch
                id="aliasing"
                checked={aliasing}
                onCheckedChange={() => dispatch({ type: 'SETTINGS_CHANGE', field: 'aliasing' })}
              />
            </div>
          </div>
          <div className="lcd-screen flex w-56 flex-col justify-between self-center p-4">
            <h3 className="lcd-inverse text-center text-lg tracking-wider">ARITHMUSIC</h3>
            <div className="mt-3 space-y-1 text-sm">
              <p>v2.0.0</p>
              <a
                href="https://github.com/chrisdruta/arithmusic"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-lcd-ink/40 hover:decoration-lcd-ink"
              >
                github.com/chrisdruta/arithmusic
              </a>
              <p>GPL v3.0</p>
            </div>
            <p className="mt-3 text-sm text-lcd-dim">
              Chris Druta
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="calc-secondary" size="sm" onClick={() => dispatch({ type: 'RESET_SETTINGS' })}>
            Defaults
          </Button>
          <Button variant="calc" size="sm" onClick={() => dispatch({ type: 'TOGGLE_MODAL', kind: 'settings' })}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
