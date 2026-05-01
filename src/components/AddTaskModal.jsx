import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { PRIORITIES, STATUSES, LABELS } from '../constants';

const DAY_LABELS = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'];

export default function AddTaskModal({ task, onClose }) {
  const { addTask, updateTask, deleteTask, projects } = useStore();
  const isEdit = !!task?.id;

  const [form, setForm] = useState({
    text: '',
    projectId: projects[0]?.id || '',
    priority: 'midden',
    labels: [],
    status: 'todo',
    estimatedMinutes: 30,
    recurring: false,
    recurringDays: [],
    recurringTime: '09:00',
    ...( task ? {
      text: task.text,
      projectId: task.projectId,
      priority: task.priority,
      labels: task.labels || [],
      status: task.status,
      estimatedMinutes: task.estimatedMinutes || 30,
      recurring: task.recurring || false,
      recurringDays: task.recurringDays || [],
      recurringTime: task.recurringTime || '09:00',
    } : {} )
  });

  const [estimating, setEstimating] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleLabel = (l) => set('labels', form.labels.includes(l) ? form.labels.filter(x => x !== l) : [...form.labels, l]);
  const toggleDay = (d) => set('recurringDays', form.recurringDays.includes(d) ? form.recurringDays.filter(x => x !== d) : [...form.recurringDays, d]);

  const handleEstimate = async () => {
    if (!form.text.trim()) return;
    setEstimating(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 100,
          system: 'Je bent een productiviteitsexpert. Schat de tijdsduur van een marketingtaak in minuten (alleen veelvouden van 15, max 480). Antwoord alleen met een getal.',
          messages: [{ role: 'user', content: `Schat de tijdsduur in minuten voor deze marketingtaak: "${form.text}"` }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || '';
      const num = parseInt(raw.replace(/\D/g, ''));
      if (num && num > 0) set('estimatedMinutes', Math.round(num / 15) * 15);
    } catch (e) {
      console.error(e);
    }
    setEstimating(false);
  };

  const handleSave = () => {
    if (!form.text.trim()) return;
    if (isEdit) {
      updateTask(task.id, form);
    } else {
      addTask({ ...form, done: false, scheduledDate: null, scheduledSlot: null });
    }
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Taak verwijderen?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  const projByCategory = (cat) => projects.filter(p => p.category === cat);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">
          {isEdit ? 'Taak bewerken' : 'Nieuwe taak'}
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="form-group">
          <label className="form-label">Taakomschrijving</label>
          <input
            className="form-input"
            placeholder="Wat moet er gedaan worden?"
            value={form.text}
            onChange={e => set('text', e.target.value)}
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Project</label>
          <select className="form-select" value={form.projectId} onChange={e => set('projectId', e.target.value)}>
            <optgroup label="Bouwbuddy">
              {projByCategory('bb').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </optgroup>
            <optgroup label="BB Media">
              {projByCategory('bbm').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </optgroup>
            <optgroup label="Persoonlijk">
              {projByCategory('persoonlijk').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </optgroup>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Prioriteit</label>
            <div className="radio-group">
              {PRIORITIES.map(p => (
                <button key={p.value} className={`radio-btn ${form.priority === p.value ? 'active' : ''}`}
                  onClick={() => set('priority', p.value)}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Labels</label>
          <div className="label-toggle-group">
            {LABELS.map(l => (
              <button key={l.value} className={`label-toggle ${form.labels.includes(l.value) ? `active-${l.value}` : ''}`}
                onClick={() => toggleLabel(l.value)}>
                {l.value} — {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tijdschatting (minuten)</label>
          <div className="ai-estimate-row">
            <input
              className="form-input"
              type="number"
              min={15}
              step={15}
              value={form.estimatedMinutes}
              onChange={e => set('estimatedMinutes', parseInt(e.target.value) || 30)}
              style={{ width: 100 }}
            />
            <button className="ai-estimate-btn" onClick={handleEstimate} disabled={estimating || !form.text.trim()}>
              {estimating ? 'Schatting…' : '✦ AI schatting'}
            </button>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>
              ≈ {Math.round(form.estimatedMinutes / 60 * 10) / 10}u
            </span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={form.recurring} onChange={e => set('recurring', e.target.checked)} />
            Wekelijks terugkerend
          </label>
        </div>

        {form.recurring && (
          <div className="form-group" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 7, padding: 12 }}>
            <label className="form-label">Dag(en) van de week</label>
            <div className="day-check-group" style={{ marginBottom: 10 }}>
              {[1,2,3,4,5].map(d => (
                <button key={d} className={`day-check ${form.recurringDays.includes(d) ? 'active' : ''}`}
                  onClick={() => toggleDay(d)}>
                  {DAY_LABELS[d]}
                </button>
              ))}
            </div>
            <label className="form-label">Starttijd</label>
            <input className="form-input" type="time" value={form.recurringTime}
              onChange={e => set('recurringTime', e.target.value)} style={{ width: 120 }} />
          </div>
        )}

        <div className="modal-actions">
          {isEdit && (
            <button className="btn btn-danger" onClick={handleDelete} style={{ marginRight: 'auto' }}>Verwijder</button>
          )}
          <button className="btn btn-secondary" onClick={onClose}>Annuleer</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!form.text.trim()}>
            {isEdit ? 'Opslaan' : 'Toevoegen'}
          </button>
        </div>
      </div>
    </div>
  );
}
