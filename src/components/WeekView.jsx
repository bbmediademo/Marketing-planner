import React, { useState, useEffect, useRef } from 'react';
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { useStore } from '../store';
import { getWeekDays, formatDate, getTimeLabels, timeToSlot, slotToTime, getWeekId } from '../utils/date';
import { DAY_SHORT, TOTAL_SLOTS, SLOT_HEIGHT } from '../constants';
import DayColumn from './DayColumn';
import BacklogPanel from './BacklogPanel';
import ChatPanel from './ChatPanel';

function buildDayLabel(date) {
  const d = new Date(date);
  const short = DAY_SHORT[d.getDay() === 0 ? 6 : d.getDay() - 1];
  const num = d.getDate();
  const today = formatDate(date) === formatDate(new Date());
  return { short, num, today };
}

export default function WeekView({ onAddTask, onEditTask }) {
  const {
    tasks, recurringTasks, calendarEvents, currentWeekStart,
    scheduleTask, unscheduleTask, updateTask,
  } = useStore();

  const [activeTask, setActiveTask] = useState(null);
  const [rightTab, setRightTab] = useState('backlog');
  const calScrollRef = useRef(null);

  const weekDays = getWeekDays(currentWeekStart);
  const timeLabels = getTimeLabels();

  useEffect(() => {
    if (calScrollRef.current) {
      const now = new Date();
      const slot = (now.getHours() - 9) * 2;
      const scrollTo = Math.max(0, (slot - 2) * SLOT_HEIGHT);
      calScrollRef.current.scrollTop = scrollTo;
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const getScheduledForDay = (dayDate) => {
    const dateStr = formatDate(dayDate);
    return tasks.filter(t => t.scheduledDate === dateStr && !t.done);
  };

  const getRecurringForDay = (dayDate) => {
    const jsDay = new Date(dayDate).getDay();
    const weekId = getWeekId(dayDate);
    return recurringTasks
      .filter(rt => (rt.recurringDays || []).includes(jsDay))
      .map(rt => ({
        ...rt,
        recurringSlot: timeToSlot(rt.recurringTime || '09:00'),
      }));
  };

  const getCalEventsForDay = (dayDate) => {
    const dateStr = formatDate(dayDate);
    return calendarEvents.filter(ev => ev.startDate === dateStr);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id)
      || recurringTasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = active.id;
    const overId = over.id;

    if (overId === 'backlog') {
      unscheduleTask(taskId);
      return;
    }

    if (typeof overId === 'string' && overId.startsWith('slot-')) {
      const parts = overId.split('-');
      const dayIndex = parseInt(parts[1]);
      const slotIndex = parseInt(parts[2]);
      const targetDate = weekDays[dayIndex];
      scheduleTask(taskId, targetDate, slotIndex);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="week-view">
        {/* Calendar grid */}
        <div className="calendar-area">
          {/* Header */}
          <div className="cal-header">
            <div className="cal-header-time" />
            {weekDays.map((day, i) => {
              const { short, num, today } = buildDayLabel(day);
              return (
                <div key={i} className={`cal-header-day ${today ? 'today' : ''}`}>
                  {today
                    ? <span className="day-num">{num}</span>
                    : <span className="day-num">{num}</span>
                  }
                  <span>{short}</span>
                </div>
              );
            })}
          </div>

          {/* Scrollable grid */}
          <div className="cal-scroll" ref={calScrollRef}>
            <div className="cal-grid">
              {/* Time column */}
              <div className="time-col">
                {timeLabels.map((t, i) => (
                  <div key={i} className={`time-label ${i % 2 === 0 ? 'hour' : ''}`}>
                    {i % 2 === 0 ? t : ''}
                  </div>
                ))}
              </div>
              {/* Day columns */}
              <div className="days-grid">
                {weekDays.map((day, i) => (
                  <DayColumn
                    key={i}
                    dayIndex={i}
                    date={day}
                    scheduledTasks={getScheduledForDay(day)}
                    recurringTasks={getRecurringForDay(day)}
                    calEvents={getCalEventsForDay(day)}
                    onEditTask={onEditTask}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className={`right-panel ${rightTab === 'chat' ? 'chat-mode' : ''}`}>
          <div className="panel-tabs">
            <button className={`panel-tab ${rightTab === 'backlog' ? 'active' : ''}`} onClick={() => setRightTab('backlog')}>Backlog</button>
            <button className={`panel-tab ${rightTab === 'chat' ? 'active' : ''}`} onClick={() => setRightTab('chat')}>Assistent</button>
          </div>
          {rightTab === 'backlog'
            ? <BacklogPanel onAddTask={onAddTask} onEditTask={onEditTask} />
            : <ChatPanel />
          }
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay dropAnimation={null}>
        {activeTask && (
          <div className="drag-overlay-card">
            <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{activeTask.text}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'Geist Mono' }}>
              {activeTask.estimatedMinutes || 30}min
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
