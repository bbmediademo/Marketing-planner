import React, { useRef, useState, useCallback } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../store';
import { slotToTime, slotEndTime, minutesToSlots } from '../utils/date';
import { SLOT_HEIGHT } from '../constants';

function getCategoryColor(projectId, projects) {
  const proj = projects.find(p => p.id === projectId);
  if (!proj) return { bg: '#f0f0ee', text: '#888' };
  if (proj.category === 'bb') return { bg: '#fdeee8', text: '#d4420a', border: '#f5c8b5' };
  if (proj.category === 'bbm') return { bg: '#e6f4f2', text: '#0a7c6e', border: '#b5dbd7' };
  return { bg: '#eceef8', text: '#5b6fc4', border: '#c5caf0' };
}

export default function TaskBlock({ task, weekId, isRecurring, onEdit }) {
  const { toggleDone, toggleRecurringDone, updateTask, updateRecurring, projects } = useStore();
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartY = useRef(null);
  const resizeStartMin = useRef(null);

  const durationMinutes = task.estimatedMinutes || 30;
  const durationSlots = minutesToSlots(durationMinutes);
  const top = (task.scheduledSlot ?? task.recurringSlot ?? 0) * SLOT_HEIGHT;
  const height = durationSlots * SLOT_HEIGHT - 2;

  const isDone = isRecurring
    ? (task.doneWeeks || []).includes(weekId)
    : task.done;

  const colors = getCategoryColor(task.projectId, projects);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { type: isRecurring ? 'recurring' : 'scheduled', task },
    disabled: isResizing,
  });

  const style = {
    top,
    height,
    background: colors.bg,
    color: colors.text,
    borderColor: colors.border || 'rgba(0,0,0,0.1)',
    transform: transform ? CSS.Translate.toString(transform) : undefined,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleToggleDone = (e) => {
    e.stopPropagation();
    if (isRecurring) toggleRecurringDone(task.id, weekId);
    else toggleDone(task.id);
  };

  const handleResizeStart = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    resizeStartY.current = e.clientY;
    resizeStartMin.current = task.estimatedMinutes || 30;

    const onMove = (me) => {
      const delta = me.clientY - resizeStartY.current;
      const slotsDelta = Math.round(delta / SLOT_HEIGHT);
      const newMin = Math.max(30, resizeStartMin.current + slotsDelta * 30);
      if (isRecurring) updateRecurring(task.id, { estimatedMinutes: newMin });
      else updateTask(task.id, { estimatedMinutes: newMin });
    };
    const onUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [task, isRecurring, updateTask, updateRecurring]);

  const timeLabel = `${slotToTime(task.scheduledSlot ?? task.recurringSlot ?? 0)} – ${slotEndTime(task.scheduledSlot ?? task.recurringSlot ?? 0, durationMinutes)}`;

  return (
    <div
      ref={setNodeRef}
      className={`task-block ${isDragging ? 'dragging' : ''} ${isDone ? 'done-block' : ''}`}
      style={style}
      onClick={() => !isDragging && onEdit && onEdit(task)}
      {...listeners}
      {...attributes}
    >
      <button className="block-done-btn" onClick={handleToggleDone}>{isDone ? '✓' : ''}</button>
      <div className="block-title" style={{ paddingRight: 18 }}>{task.text}</div>
      <div className="block-time">{timeLabel} · {durationMinutes}min</div>
      {isRecurring && (
        <div style={{ position: 'absolute', bottom: 14, left: 6, fontSize: 8, opacity: 0.5 }}>↻</div>
      )}
      <div className="resize-handle" onMouseDown={handleResizeStart} />
    </div>
  );
}

export function CalendarEventBlock({ event }) {
  const top = event.startSlot * SLOT_HEIGHT;
  const height = event.durationSlots * SLOT_HEIGHT - 2;
  const startTime = slotToTime(event.startSlot);

  return (
    <div className="cal-event-block" style={{ top, height }}>
      <div className="event-title">{event.title}</div>
      <div className="event-time">{startTime}</div>
    </div>
  );
}
