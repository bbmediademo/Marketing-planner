import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getWeekStart, formatDate, addDays } from './utils/date';
import { INITIAL_TASKS, INITIAL_PROJECTS, INITIAL_RECURRING } from './constants';

const initialWeekStart = formatDate(getWeekStart(new Date()));

export const useStore = create(
  persist(
    (set, get) => ({
      tasks: INITIAL_TASKS,
      recurringTasks: INITIAL_RECURRING,
      projects: INITIAL_PROJECTS,
      calendarEvents: [],
      currentWeekStart: initialWeekStart,
      settings: { icsUrl: '' },
      toast: null,

      // Week navigation
      goToPrevWeek: () => set(s => ({ currentWeekStart: formatDate(addDays(s.currentWeekStart, -7)) })),
      goToNextWeek: () => set(s => ({ currentWeekStart: formatDate(addDays(s.currentWeekStart, 7)) })),
      goToThisWeek: () => set({ currentWeekStart: formatDate(getWeekStart(new Date())) }),

      // Tasks
      addTask: (task) => {
        const t = { ...task, id: `t${Date.now()}`, done: false, scheduledDate: null, scheduledSlot: null };
        set(s => ({ tasks: [t, ...s.tasks] }));
        get().showToast('Taak toegevoegd');
      },
      updateTask: (id, updates) => set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...updates } : t) })),
      deleteTask: (id) => { set(s => ({ tasks: s.tasks.filter(t => t.id !== id) })); get().showToast('Taak verwijderd'); },
      toggleDone: (id) => set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t) })),
      scheduleTask: (id, date, slot) => set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, scheduledDate: formatDate(date), scheduledSlot: slot } : t) })),
      unscheduleTask: (id) => set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, scheduledDate: null, scheduledSlot: null } : t) })),

      // Recurring tasks
      addRecurring: (task) => {
        const t = { ...task, id: `rec${Date.now()}`, doneWeeks: [] };
        set(s => ({ recurringTasks: [...s.recurringTasks, t] }));
      },
      updateRecurring: (id, updates) => set(s => ({ recurringTasks: s.recurringTasks.map(t => t.id === id ? { ...t, ...updates } : t) })),
      deleteRecurring: (id) => set(s => ({ recurringTasks: s.recurringTasks.filter(t => t.id !== id) })),
      toggleRecurringDone: (id, weekId) => set(s => ({
        recurringTasks: s.recurringTasks.map(t => {
          if (t.id !== id) return t;
          const doneWeeks = t.doneWeeks || [];
          return { ...t, doneWeeks: doneWeeks.includes(weekId) ? doneWeeks.filter(w => w !== weekId) : [...doneWeeks, weekId] };
        })
      })),

      // Projects
      addProject: (proj) => set(s => ({ projects: [...s.projects, { ...proj, id: `proj-${Date.now()}` }] })),
      updateProject: (id, updates) => set(s => ({ projects: s.projects.map(p => p.id === id ? { ...p, ...updates } : p) })),
      deleteProject: (id) => set(s => ({ projects: s.projects.filter(p => p.id !== id) })),

      // Calendar events
      setCalendarEvents: (events) => set({ calendarEvents: events }),

      // Settings
      updateSettings: (updates) => set(s => ({ settings: { ...s.settings, ...updates } })),

      // Toast
      showToast: (msg) => {
        set({ toast: msg });
        setTimeout(() => set({ toast: null }), 2500);
      },
    }),
    { name: 'marketing-planner-v1' }
  )
);
