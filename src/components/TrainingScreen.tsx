import { TrainingPanel } from './TrainingPanel';

export function TrainingScreen() {
  return (
    <div className="py-2">
      <TrainingPanel isOpen={true} onToggle={() => {}} />
    </div>
  );
}
