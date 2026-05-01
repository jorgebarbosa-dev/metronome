import { TimeSignatureSelector } from './TimeSignatureSelector';
import { VolumeControl } from './VolumeControl';
import { AccentToggle } from './AccentToggle';
import { SubdivisionSelector } from './SubdivisionSelector';

export function SettingsScreen() {
  return (
    <div className="flex flex-col gap-6 py-2">
      <TimeSignatureSelector />
      <VolumeControl />
      <AccentToggle />
      <SubdivisionSelector />
    </div>
  );
}
