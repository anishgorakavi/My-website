import React, { useState } from 'react';
import { bevoFrames } from '../data/bevoFrames.js';

export default function BevoTerminal() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className={`bevo-terminal${isPaused ? ' paused' : ''}`}>
      <div className="bevo-bar">
        <span>BEVO.RUN / TEXAS</span>
        <button
          type="button"
          onClick={() => setIsPaused(paused => !paused)}
          aria-pressed={isPaused}
          aria-label={isPaused ? 'Resume Bevo animation' : 'Pause Bevo animation'}
        >
          {isPaused ? 'PLAY ▷' : 'PAUSE Ⅱ'}
        </button>
      </div>
      <div
        className="bevo-scene"
        role="img"
        aria-label="Animated ASCII Bevo facing the viewer, with wide longhorn horns and alternating front legs, running gently forward in place"
      >
        <div className="bevo-runner" aria-hidden="true">
          {bevoFrames.map((frame, index) => (
            <pre key={index} className={`bevo-frame frame-${index}`}>{frame}</pre>
          ))}
        </div>
        <div className="bevo-track" aria-hidden="true">·     .       ____       .     ·</div>
      </div>
      <div className="bevo-footer">
        <span>HOOK ’EM.</span>
        <span>~/austin/tx <span className="bevo-cursor" aria-hidden="true">▌</span></span>
      </div>
    </div>
  );
}
