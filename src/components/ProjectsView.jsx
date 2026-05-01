import React, { useState } from 'react';
import { useStore } from '../store';
import { CATEGORIES, STATUSES } from '../constants';

function StatusPill({ status }) {
  const s = STATUSES.find(x => x.value === status) || { label: status, color: '#888', bg: '#f0f0f0' };
  return <span className={`badge badge-${status}`}>{s.label}</span>;
}

function ProjectModal({ proj, onClose }) {
  const { addProject, updateProject, deleteProject, projects } = useStore();
  const isEdit = !!proj?.id;

  const [form, setForm] = useState({
    name: '', category: 'bb', status: 'todo', description: '', nextSteps: [],
    ...(proj ? { name: proj.name, category: proj.category, status: proj.status, description: proj.description, nextSteps: proj.nextSteps || [] } : {})
  });
  const [newStep, setNewStep] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addStep = () => {
    if (!newStep.trim()) return;
    set('nextSteps', [...form.nextSteps, newStep.trim()]);
    setNewStep('');
  };

  const removeStep = (i) => set('nextSteps', form.nextSteps.filter((_, idx) => idx !== i));

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (isEdit) updateProject(proj.id, form);
    else addProject(form);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Project verwijderen? Taken blijven bestaan.')) {
      deleteProject(proj.id);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">
          {isEdit ? 'Project bewerken' : 'Nieuw project'}
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="form-group">
          <label className="form-label">Projectnaam</label>
          <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Naam van het project" autoFocus />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Organisatie</label>
            <div className="radio-group">
              {CATEGORIES.map(c => (
                <button key={c.value} className={`radio-btn ${form.category === c.value ? 'active' : ''}`}
                  onClick={() => set('category', c.value)}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={e => set('status', e.target.value)}>
              {STATUSES.filter(s => ['todo','bezig','wachten','bespreken','live','inrichten'].includes(s.value)).map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Omschrijving</label>
          <textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Korte projectomschrijving" />
        </div>

        <div className="form-group">
          <label className="form-label">Volgende stappen</label>
          {form.nextSteps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'center' }}>
              <div style={{ flex: 1, fontSize: 12, padding: '5px 8px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 5 }}>
                → {step}
              </div>
              <button onClick={() => removeStep(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted2)', fontSize: 14 }}>×</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <input className="form-input" value={newStep} onChange={e => setNewStep(e.target.value)} placeholder="Volgende stap toevoegen…" onKeyDown={e => e.key === 'Enter' && addStep()} />
            <button className="btn btn-secondary" onClick={addStep}>+</button>
          </div>
        </div>

        <div className="modal-actions">
          {isEdit && <button className="btn btn-danger" onClick={handleDelete} style={{ marginRight: 'auto' }}>Verwijder</button>}
          <button className="btn btn-secondary" onClick={onClose}>Annuleer</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!form.name.trim()}>
            {isEdit ? 'Opslaan' : 'Aanmaken'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsView({ onAddTask }) {
  const { projects, tasks } = useStore();
  const [editProj, setEditProj] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getTaskCount = (projId) => tasks.filter(t => t.projectId === projId && !t.done).length;

  const renderCategory = (cat) => {
    const catInfo = CATEGORIES.find(c => c.value === cat);
    const projs = projects.filter(p => p.category === cat);
    if (!projs.length) return null;

    return (
      <div key={cat}>
        <div className="proj-section-head">
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: catInfo.color, flexShrink: 0 }} />
          {catInfo.label}
          <div className="proj-section-line" />
          <button
            onClick={() => { setEditProj({ category: cat }); setShowModal(true); }}
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 8px', fontSize: 10, cursor: 'pointer', color: 'var(--muted)', whiteSpace: 'nowrap' }}
          >
            + Project
          </button>
        </div>
        <div className="proj-grid">
          {projs.map(proj => (
            <div key={proj.id} className={`proj-card cat-${proj.category}`}>
              <div className="proj-card-top">
                <div className="proj-card-name">{proj.name}</div>
                <StatusPill status={proj.status} />
              </div>
              {proj.description && (
                <div className="proj-card-body">{proj.description}</div>
              )}
              {proj.nextSteps?.length > 0 && (
                <div className="proj-actions">
                  <div className="proj-action-label">Volgende stappen</div>
                  {proj.nextSteps.map((step, i) => (
                    <div key={i} className="proj-action-item">
                      <span className="proj-action-arrow">→</span>
                      {step}
                    </div>
                  ))}
                </div>
              )}
              <div className="proj-task-count">
                {getTaskCount(proj.id)} open taken
              </div>
              <button
                className="proj-edit-btn"
                onClick={() => { setEditProj(proj); setShowModal(true); }}
              >
                ✎ Bewerk
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="projects-view">
      {['bb', 'bbm', 'persoonlijk'].map(cat => renderCategory(cat))}

      {showModal && (
        <ProjectModal
          proj={editProj?.id ? editProj : null}
          onClose={() => { setShowModal(false); setEditProj(null); }}
        />
      )}
    </div>
  );
}
