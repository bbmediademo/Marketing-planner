import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useStore } from '../store';
import BacklogCard from './BacklogCard';

const PRIORITY_ORDER = { hoog: 0, midden: 1, laag: 2 };

export default function BacklogPanel({ onAddTask, onEditTask }) {
  const { tasks, projects } = useStore();
  const [filterProject, setFilterProject] = useState('all');
  const [filterPriority, setFilterPriority] = useState(null);
  const [filterLabel, setFilterLabel] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [search, setSearch] = useState('');
  const [showDone, setShowDone] = useState(false);

  const { setNodeRef, isOver } = useDroppable({ id: 'backlog' });

  const unscheduled = tasks.filter(t => !t.scheduledDate);

  const filtered = unscheduled.filter(t => {
    if (search && !t.text.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterProject !== 'all') {
      const proj = projects.find(p => p.id === t.projectId);
      if (!proj || proj.category !== filterProject) return false;
    }
    if (filterPriority && t.priority !== filterPriority) return false;
    if (filterLabel && !(t.labels || []).includes(filterLabel)) return false;
    if (filterStatus && t.status !== filterStatus) return false;
    return true;
  });

  const active = filtered.filter(t => !t.done && t.status !== 'wachten');
  const waiting = filtered.filter(t => !t.done && t.status === 'wachten');
  const done = filtered.filter(t => t.done);

  active.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 2) - (PRIORITY_ORDER[b.priority] ?? 2));

  const toggleFilter = (type, val, setter, current) => {
    setter(current === val ? null : val);
  };

  return (
    <div className="backlog-panel" ref={setNodeRef} style={isOver ? { background: '#f0f0ee' } : {}}>
      <div className="backlog-filters">
        <div className="filter-row">
          <span className="filter-label-sm">Org</span>
          {['all', 'bb', 'bbm', 'persoonlijk'].map(v => (
            <button key={v} className={`fbtn ${filterProject === v ? 'active' : ''}`}
              onClick={() => setFilterProject(v)}>
              {v === 'all' ? 'Alles' : v === 'bb' ? 'BW' : v === 'bbm' ? 'BBM' : 'Pers'}
            </button>
          ))}
        </div>
        <div className="filter-row">
          <span className="filter-label-sm">Prio</span>
          {['hoog', 'midden', 'laag'].map(v => (
            <button key={v} className={`fbtn ${filterPriority === v ? 'active' : ''}`}
              onClick={() => toggleFilter('prio', v, setFilterPriority, filterPriority)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <div className="filter-row">
          <span className="filter-label-sm">Label</span>
          {['S', 'L', 'W', 'P'].map(v => (
            <button key={v} className={`fbtn ${filterLabel === v ? 'active' : ''}`}
              onClick={() => toggleFilter('label', v, setFilterLabel, filterLabel)}>
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="backlog-search">
        <input
          className="search-input"
          placeholder="Zoeken..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="backlog-list">
        {active.length > 0 && (
          <>
            <div className="backlog-section-head">
              <div className="dot" style={{ background: 'var(--text)' }} />
              Actief · {active.length}
            </div>
            {active.map(t => <BacklogCard key={t.id} task={t} onEdit={onEditTask} />)}
          </>
        )}

        {waiting.length > 0 && (
          <>
            <div className="backlog-section-head">
              <div className="dot" style={{ background: '#c07a00' }} />
              Wachten · {waiting.length}
            </div>
            {waiting.map(t => <BacklogCard key={t.id} task={t} onEdit={onEditTask} />)}
          </>
        )}

        {done.length > 0 && (
          <>
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', padding: '8px 4px', fontFamily: 'Geist Mono', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em' }}
              onClick={() => setShowDone(s => !s)}
            >
              {showDone ? '▾' : '▸'} Gedaan ({done.length})
            </button>
            {showDone && done.map(t => <BacklogCard key={t.id} task={t} onEdit={onEditTask} />)}
          </>
        )}

        {active.length === 0 && waiting.length === 0 && (
          <div className="empty-state">Geen open taken<br />voor deze filters</div>
        )}
      </div>

      <button className="add-task-btn" onClick={onAddTask}>
        + Nieuwe taak toevoegen
      </button>
    </div>
  );
}
