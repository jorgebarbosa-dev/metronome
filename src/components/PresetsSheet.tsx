import { PresetManager } from './PresetManager';
import { PresetList } from './PresetList';

export function PresetsSheet() {
  return (
    <div className="flex flex-col gap-4 py-2">
      <PresetManager />
      <PresetList />
    </div>
  );
}
