import React, { useState } from 'react';
import { useStore } from '../store';
import { parseICS } from '../utils/icsParser';

export default function SettingsModal({ onClose }) {
  const { settings, updateSettings, setCalendarEvents, calendarEvents, showToast } = useStore();
  const [icsUrl, setIcsUrl] = useState(settings.icsUrl || '');
  const [syncing, setSyncing] = useState(false);

  const handleSyncICS = async () => {
    if (!icsUrl.trim()) return;
    setSyncing(true);
    try {
      const encoded = encodeURIComponent(icsUrl.trim());
      const res = await fetch(`/api/ics-proxy?url=${encoded}`);
      if (!res.ok) throw new Error('Kon ICS niet ophalen');
      const text = await res.text();
      const events = parseICS(text);
      setCalendarEvents(events);
      updateSettings({ icsUrl: icsUrl.trim() });
      showToast(`${events.length} agenda-items geladen`);
    } catch (e) {
      alert('Fout bij laden agenda: ' + e.message);
    }
    setSyncing(false);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">
          Instellingen
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="form-group">
          <label className="form-label">Outlook Agenda (ICS URL)</label>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8, lineHeight: 1.5 }}>
            Haal je ICS link op via: Outlook → Kalender → Instellingen → Gedeelde agenda's → Agenda publiceren → ICS-koppeling kopiëren.
          </p>
          <input
            className="form-input"
            type="url"
            placeholder="https://outlook.live.com/owa/calendar/.../calendar.ics"
            value={icsUrl}
            onChange={e => setIcsUrl(e.target.value)}
          />
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="btn btn-primary" onClick={handleSyncICS} disabled={syncing || !icsUrl.trim()}>
              {syncing ? 'Laden…' : 'Agenda laden'}
            </button>
            {calendarEvents.length > 0 && (
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                ✓ {calendarEvents.length} items geladen
              </span>
            )}
          </div>
        </div>

        <div className="form-group" style={{ marginTop: 20, padding: 14, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8 }}>
          <label className="form-label">AI Assistent (Anthropic API)</label>
          <p style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>
            De AI werkt via een Netlify Function. Zet je API sleutel in Netlify:
            <br /><strong>Site settings → Environment variables → ANTHROPIC_API_KEY</strong>
            <br /><br />
            Na het deployen is de AI automatisch beschikbaar. Geen API sleutel nodig in de browser.
          </p>
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onClose}>Sluiten</button>
        </div>
      </div>
    </div>
  );
}
