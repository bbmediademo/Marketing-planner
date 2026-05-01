import React from 'react';
import { useStore } from '../store';
import { formatWeekLabel, getWeekStart, formatDate } from '../utils/date';

export default function TopBar({ onSettings, onICS }) {
  const { currentWeekStart, goToPrevWeek, goToNextWeek, goToThisWeek, calendarEvents, settings } = useStore();
  const thisWeek = formatDate(getWeekStart(new Date())) === currentWeekStart;

  return (
    <div className="topbar">
      <div className="topbar-left">
        <span className="logo">MEES · MARKETING</span>
        <div className="week-nav">
          <button onClick={goToPrevWeek}>‹</button>
          <span className="week-label">{formatWeekLabel(currentWeekStart)}</span>
          <button onClick={goToNextWeek}>›</button>
          {!thisWeek && <button className="today" onClick={goToThisWeek}>Vandaag</button>}
        </div>
      </div>
      <div className="topbar-right">
        <div className="ics-status" title="Outlook agenda">
          <div className={`ics-dot ${calendarEvents.length > 0 ? 'connected' : ''}`} />
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontFamily: 'inherit', fontSize: '10px' }}
            onClick={onICS}
          >
            {calendarEvents.length > 0 ? `Agenda (${calendarEvents.length})` : 'Agenda koppelen'}
          </button>
        </div>
        <button className="icon-btn" onClick={onSettings} title="Instellingen">⚙</button>
      </div>
    </div>
  );
}
