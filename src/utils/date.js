import { START_HOUR, TOTAL_SLOTS } from '../constants';

export function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function formatDate(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseDate(str) {
  return new Date(str + 'T00:00:00');
}

export function isSameDay(a, b) {
  return formatDate(a) === formatDate(b);
}

export function isToday(date) {
  return formatDate(date) === formatDate(new Date());
}

export function slotToTime(slot) {
  const totalMin = START_HOUR * 60 + slot * 30;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function timeToSlot(time) {
  const [h, m] = time.split(':').map(Number);
  return (h - START_HOUR) * 2 + Math.floor(m / 30);
}

export function minutesToSlots(min) {
  return Math.max(1, Math.ceil(min / 30));
}

export function getWeekId(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const wn = 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(wn).padStart(2, '0')}`;
}

export function getWeekDays(weekStart) {
  return Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));
}

export function formatWeekLabel(weekStart) {
  const end = addDays(weekStart, 4);
  const opts = { day: 'numeric', month: 'long' };
  const s = new Date(weekStart).toLocaleDateString('nl-NL', opts);
  const e = new Date(end).toLocaleDateString('nl-NL', opts);
  return `${s} – ${e}`;
}

export function formatDayLabel(date) {
  return new Date(date).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function slotEndTime(slot, durationMinutes) {
  const startMin = START_HOUR * 60 + slot * 30;
  const endMin = startMin + durationMinutes;
  const h = Math.floor(endMin / 60);
  const m = endMin % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function getTimeLabels() {
  return Array.from({ length: TOTAL_SLOTS + 1 }, (_, i) => slotToTime(i));
}
