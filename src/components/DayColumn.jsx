import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TOTAL_SLOTS, SLOT_HEIGHT } from '../constants';
import TaskBlock, { CalendarEventBlock } from './TaskBlock';
import { formatDate, isToday, getWeekId } from '../utils/date';

function SlotCell({ id, index }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const isHour = (index + 1) % 2 === 0;
  return (
    <div
      ref={setNodeRef}
      className={`slot-cell ${isHour ? 'hour-end' : 'half-hour'} ${isOver ? 'drag-over-slot' : ''}`}
    />
  );
}

export default function DayColumn({ dayIndex, date, scheduledTasks, recurringTasks, calEvents, onEditTask }) {
  const today = isToday(date);
  const dateStr = formatDate(date);
  const weekId = getWeekId(date);

  const nowSlot = (() => {
    if (!today) return null;
    const now = new Date();
    const slot = (now.getHours() - 9) * 2 + now.getMinutes() / 30;
    return slot >= 0 && slot <= 16 ? slot : null;
  })();

  return (
    <div className={`day-col ${today ? 'today-col' : ''}`}>
      {/* Slot cells as drop targets */}
      {Array.from({ length: TOTAL_SLOTS }, (_, i) => (
        <SlotCell key={i} id={`slot-${dayIndex}-${i}`} index={i} />
      ))}

      {/* Events layer */}
      <div className="events-layer" style={{ height: TOTAL_SLOTS * SLOT_HEIGHT }}>
        {/* Calendar events (ICS) */}
        {calEvents.map(ev => (
          <CalendarEventBlock key={ev.id} event={ev} />
        ))}

        {/* Recurring tasks */}
        {recurringTasks.map(rt => (
          <TaskBlock
            key={`rec-${rt.id}`}
            task={{ ...rt, scheduledSlot: rt.recurringSlot }}
            weekId={weekId}
            isRecurring
            onEdit={onEditTask}
          />
        ))}

        {/* Scheduled tasks */}
        {scheduledTasks.map(task => (
          <TaskBlock
            key={task.id}
            task={task}
            weekId={weekId}
            isRecurring={false}
            onEdit={onEditTask}
          />
        ))}

        {/* Now line */}
        {nowSlot !== null && (
          <div className="now-line" style={{ top: nowSlot * SLOT_HEIGHT }} />
        )}
      </div>
    </div>
  );
}
