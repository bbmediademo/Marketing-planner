import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../store';
import { CATEGORIES } from '../constants';

function catClass(category) {
  if (category === 'bb') return 'badge-bb';
  if (category === 'bbm') return 'badge-bbm';
  return 'badge-pers';
}

export default function BacklogCard({ task, onEdit }) {
  const { toggleDone, deleteTask, projects } = useStore();
  const proj = projects.find(p => p.id === task.projectId);
  const cat = proj?.category || 'bb';

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { type: 'backlog', task },
  });

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
  };

  const handleDoneClick = (e) => { e.stopPropagation(); toggleDone(task.id); };
  const handleDeleteClick = (e) => { e.stopPropagation(); deleteTask(task.id); };
  const handleEditClick = (e) => { e.stopPropagation(); onEdit(task); };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`backlog-card ${isDragging ? 'dragging' : ''} ${task.done ? 'done-card' : ''}`}
      {...listeners}
      {...attributes}
      onClick={() => onEdit(task)}
    >
      <div className="backlog-card-actions" onClick={e => e.stopPropagation()}>
        <button className="card-action-btn" onClick={handleDoneClick}>{task.done ? 'Undo' : '✓'}</button>
        <button className="card-action-btn" onClick={handleEditClick}>✎</button>
        <button className="card-action-btn del" onClick={handleDeleteClick}>×</button>
      </div>
      <div className="backlog-card-title">{task.text}</div>
      <div className="backlog-card-meta">
        <span className={`badge ${catClass(cat)}`}>{proj?.name?.split(' ')[0] || cat}</span>
        <span className={`badge badge-${task.priority}`}>{task.priority}</span>
        {(task.labels || []).map(l => (
          <span key={l} className={`badge badge-${l}`}>{l}</span>
        ))}
        {task.estimatedMinutes && (
          <span className="badge badge-time">{task.estimatedMinutes}min</span>
        )}
      </div>
    </div>
  );
}
