'use client';

import { useState } from 'react';
import type { Motion, Prefs, Theme, WallpaperId } from '@/workspace/prefs';

interface SettingsAppProps {
  prefs: Prefs;
  storageAvailable: boolean;
  onChange: (patch: Partial<Prefs>) => void;
  onReset: () => void;
}

const THEME_LABELS: Record<Theme, string> = { system: 'Match the portfolio', light: 'Light', dark: 'Dark' };
const WALLPAPER_LABELS: Record<WallpaperId, string> = { dawn: 'Himalayan dawn', dusk: 'Himalayan dusk', night: 'Himalayan night' };
const MOTION_LABELS: Record<Motion, string> = { system: 'Match my device', reduced: 'Reduce motion' };

/**
 * Generic radio group rendered as a labelled fieldset.
 *
 * @param props.legend Visible group name.
 * @param props.name Form name shared by the radios.
 * @param props.options Value → label map, in display order.
 * @param props.value The selected value.
 * @param props.onPick Called with the newly chosen value.
 * @param props.swatch Optional decorative preview rendered before each label.
 */
function Choice<T extends string>({
  legend,
  name,
  options,
  value,
  onPick,
  swatch,
}: {
  legend: string;
  name: string;
  options: Record<T, string>;
  value: T;
  onPick: (value: T) => void;
  swatch?: (value: T) => React.ReactNode;
}) {
  return (
    <fieldset className="gw-set-group">
      <legend>{legend}</legend>
      <div className="gw-set-options">
        {(Object.keys(options) as T[]).map((option) => (
          <label key={option} className="gw-set-option">
            <input type="radio" name={name} value={option} checked={value === option} onChange={() => onPick(option)} />
            {swatch?.(option)}
            <span>{options[option]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Workspace settings: appearance, wallpaper, motion and sound, plus a full reset.
 * Changes apply immediately and are remembered on this device when the browser allows it.
 */
export function SettingsApp({ prefs, storageAvailable, onChange, onReset }: SettingsAppProps) {
  // 'cancelled' differs from 'idle' only in returning focus to the reset button after Cancel.
  const [step, setStep] = useState<'idle' | 'confirming' | 'cancelled'>('idle');

  return (
    <div className="gw-settings">
      <h3 className="gw-app-heading">Settings</h3>
      <p className="gw-set-note">
        {storageAvailable
          ? 'Changes apply right away and are remembered on this device, together with your open windows.'
          : 'This browser is not allowing the workspace to save anything, so changes last until you leave.'}
      </p>

      <Choice legend="Window appearance" name="gw-theme" options={THEME_LABELS} value={prefs.theme} onPick={(theme) => onChange({ theme })} />
      <Choice
        legend="Wallpaper"
        name="gw-wallpaper"
        options={WALLPAPER_LABELS}
        value={prefs.wallpaper}
        onPick={(wallpaper) => onChange({ wallpaper })}
        swatch={(id) => <span className="gw-swatch" data-wallpaper={id} aria-hidden="true" />}
      />
      <Choice legend="Motion" name="gw-motion" options={MOTION_LABELS} value={prefs.motion} onPick={(motion) => onChange({ motion })} />

      <fieldset className="gw-set-group">
        <legend>Sound</legend>
        <label className="gw-set-option">
          <input type="checkbox" checked={prefs.sound} onChange={(e) => onChange({ sound: e.target.checked })} />
          <span>Play soft sounds when windows open, minimize and close</span>
        </label>
      </fieldset>

      <section className="gw-set-group" aria-labelledby="gw-reset-title">
        <h4 id="gw-reset-title">Reset</h4>
        {step === 'confirming' ? (
          <div className="gw-set-confirm" role="group" aria-labelledby="gw-reset-question">
            <p id="gw-reset-question">Reset appearance, wallpaper, motion, sound and window layout to their defaults?</p>
            <div>
              <button
                type="button"
                className="gw-btn gw-btn-danger"
                onClick={() => {
                  setStep('idle');
                  onReset();
                }}
              >
                Reset everything
              </button>
              <button type="button" className="gw-btn" autoFocus onClick={() => setStep('cancelled')}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="gw-btn" autoFocus={step === 'cancelled'} onClick={() => setStep('confirming')}>
            Reset workspace…
          </button>
        )}
      </section>
    </div>
  );
}
