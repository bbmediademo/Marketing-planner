import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store';

const buildSystemPrompt = (tasks, projects) => {
  const open = tasks.filter(t => !t.done).map(t => ({
    id: t.id, text: t.text, project: projects.find(p => p.id === t.projectId)?.name, prio: t.priority, labels: t.labels, status: t.status, estimatedMinutes: t.estimatedMinutes
  }));
  return `Je bent een slimme marketingplanning-assistent voor Mees. Hij runt Bouwbuddy (recruitment marketing) en BB Media (webdesign bureau).

Je beheert zijn takenlijst en weekplanning. Huidige open taken:
${JSON.stringify(open.slice(0, 30), null, 2)}

LABELS: S=Snel(<1u), L=Langdurig, W=Wachten, P=Project
PRIORITEIT: hoog, midden, laag
STATUS: todo, bezig, wachten, done

Reageer ALLEEN met geldig JSON als er acties zijn:
{
  "actions": [
    { "type": "done", "id": "t5" },
    { "type": "add", "text": "...", "projectId": "bb-social", "priority": "hoog", "labels": ["S"], "status": "todo", "estimatedMinutes": 30 },
    { "type": "update", "id": "t3", "updates": { "priority": "hoog" } }
  ],
  "message": "Kort berichtje in het Nederlands"
}

Alleen tekst als je geen acties hebt. Wees kort en direct.`;
};

export default function ChatPanel() {
  const { tasks, projects, addTask, toggleDone, updateTask, showToast } = useStore();
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hey Mees! Zeg wat er klaar is, wat erbij moet of vraag me iets — ik pas de lijst direct aan. Gebruik de Granola-knop om meeting notities om te zetten naar taken.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGranola, setShowGranola] = useState(false);
  const messagesRef = useRef(null);
  const historyRef = useRef([]);

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  const addMsg = (role, text) => setMessages(m => [...m, { role, text }]);

  const sendToAPI = async (userMsg, systemPrompt) => {
    historyRef.current.push({ role: 'user', content: userMsg });
    const body = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: historyRef.current,
    };

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    const raw = data.content?.[0]?.text || '';
    historyRef.current.push({ role: 'assistant', content: raw });
    return raw;
  };

  const processActions = (parsed) => {
    for (const a of parsed.actions || []) {
      if (a.type === 'done') {
        toggleDone(a.id);
      } else if (a.type === 'add') {
        addTask({
          text: a.text,
          projectId: a.projectId || 'persoonlijk',
          priority: a.priority || 'midden',
          labels: a.labels || ['S'],
          status: a.status || 'todo',
          estimatedMinutes: a.estimatedMinutes || 30,
          recurring: false,
          scheduledDate: null,
          scheduledSlot: null,
        });
      } else if (a.type === 'update') {
        updateTask(a.id, a.updates);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    addMsg('user', text);
    setLoading(true);

    try {
      const raw = await sendToAPI(text, buildSystemPrompt(tasks, projects));
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) {
        const parsed = JSON.parse(m[0]);
        processActions(parsed);
        addMsg('ai', parsed.message || 'Gedaan!');
      } else {
        addMsg('ai', raw);
      }
    } catch (e) {
      addMsg('ai', `Fout: ${e.message}. Controleer of ANTHROPIC_API_KEY is ingesteld in Netlify.`);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="chat-panel">
      <div className="chat-messages" ref={messagesRef}>
        {messages.map((m, i) => (
          <div key={i} className={`msg msg-${m.role} ${m.loading ? 'loading' : ''}`}>{m.text}</div>
        ))}
        {loading && <div className="msg msg-ai loading">Even denken…</div>}
      </div>

      <div style={{ padding: '6px 10px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <button className="granola-btn" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowGranola(true)}>
          ✦ Granola meeting → taken
        </button>
      </div>

      <div className="chat-input-area">
        <textarea
          className="chat-textarea"
          rows={2}
          placeholder="'API keys zijn gefixed' of 'voeg toe: offerte klant X, hoog, bbm'…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className="chat-send-btn" onClick={handleSend} disabled={loading}>Stuur</button>
      </div>

      {showGranola && <GranolaModal onClose={() => setShowGranola(false)} onAddTasks={processActions} sendToAPI={sendToAPI} projects={projects} />}
    </div>
  );
}

function GranolaModal({ onClose, onAddTasks, sendToAPI, projects }) {
  const { addTask } = useStore();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggested, setSuggested] = useState([]);
  const [selected, setSelected] = useState({});

  const handleAnalyze = async () => {
    if (!notes.trim()) return;
    setLoading(true);
    const projectList = projects.map(p => `${p.id}: ${p.name} (${p.category})`).join('\n');
    const prompt = `Analyseer deze meeting notities en maak een lijst van concrete actiepunten/taken.

Meeting notities:
${notes}

Beschikbare projecten:
${projectList}

Geef terug als JSON:
{
  "tasks": [
    { "text": "Taakomschrijving", "projectId": "project-id", "priority": "hoog|midden|laag", "labels": ["S"], "estimatedMinutes": 30 }
  ],
  "summary": "Korte samenvatting van de meeting"
}`;

    try {
      const raw = await sendToAPI(prompt, 'Je bent een assistent die meeting notities omzet naar concrete taken. Reageer alleen met geldig JSON.');
      const m = raw.match(/\{[\s\S]*\}/);
      if (m) {
        const parsed = JSON.parse(m[0]);
        setSuggested(parsed.tasks || []);
        const sel = {};
        (parsed.tasks || []).forEach((_, i) => sel[i] = true);
        setSelected(sel);
      }
    } catch (e) {
      alert('Fout bij analyseren: ' + e.message);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    suggested.forEach((t, i) => {
      if (selected[i]) {
        addTask({
          text: t.text,
          projectId: t.projectId || 'persoonlijk',
          priority: t.priority || 'midden',
          labels: t.labels || ['S'],
          status: 'todo',
          estimatedMinutes: t.estimatedMinutes || 30,
          recurring: false,
          scheduledDate: null,
          scheduledSlot: null,
        });
      }
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">
          Granola meeting → taken
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {suggested.length === 0 ? (
          <>
            <div className="form-group">
              <label className="form-label">Plak je meeting notities hier</label>
              <textarea
                className="granola-notes-area"
                placeholder="Kopieer je Granola meeting samenvatting of notities hier..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={onClose}>Annuleer</button>
              <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading || !notes.trim()}>
                {loading ? 'Analyseren…' : '✦ Maak taken met AI'}
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
              {suggested.length} taken gevonden. Selecteer welke je wil toevoegen:
            </p>
            <div className="suggested-tasks">
              {suggested.map((t, i) => (
                <div key={i} className="suggested-task">
                  <input type="checkbox" checked={!!selected[i]} onChange={() => setSelected(s => ({ ...s, [i]: !s[i] }))} />
                  <div className="suggested-task-text">
                    <div style={{ fontWeight: 500, marginBottom: 2 }}>{t.text}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'Geist Mono' }}>
                      {t.priority} · {t.estimatedMinutes}min · {projects.find(p => p.id === t.projectId)?.name || t.projectId}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setSuggested([])}>← Terug</button>
              <button className="btn btn-primary" onClick={handleAdd}>
                Voeg geselecteerde toe ({Object.values(selected).filter(Boolean).length})
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
