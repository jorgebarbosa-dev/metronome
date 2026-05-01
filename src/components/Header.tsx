import { Settings, Maximize2 } from 'lucide-react';
import { useMetronome } from '../context/MetronomeContext';
import { useFullscreen } from '../hooks/useFullscreen';
import { OfflineIndicator } from './OfflineIndicator';

interface HeaderProps {
  onOpenSettings: () => void;
}

export function Header({ onOpenSettings }: HeaderProps) {
  const { state } = useMetronome();
  const { toggleFullscreen } = useFullscreen();
  const timeSignatureText = `${state.timeSignature.beats}/${state.timeSignature.beatValue}`;

  return (
    <header className="flex items-center justify-between h-14">
      {/* Left: Settings */}
      <button
        onClick={onOpenSettings}
        aria-label="Open settings"
        className="w-11 h-11 rounded-[14px] bg-white/[0.06] flex items-center justify-center text-white/70 active:scale-90 transition-transform [@media(hover:hover)]:hover:bg-white/[0.10]"
      >
        <Settings className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Center: Time signature + offline */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-white/50 tracking-wide">
          {timeSignatureText}
        </span>
        <OfflineIndicator />
      </div>

      {/* Right: Fullscreen */}
      <button
        onClick={toggleFullscreen}
        aria-label="Toggle fullscreen"
        className="w-11 h-11 rounded-[14px] bg-white/[0.06] flex items-center justify-center text-white/70 active:scale-90 transition-transform [@media(hover:hover)]:hover:bg-white/[0.10]"
      >
        <Maximize2 className="w-5 h-5" aria-hidden="true" />
      </button>
    </header>
  );
}
