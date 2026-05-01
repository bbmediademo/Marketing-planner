import { formatDate, timeToSlot, minutesToSlots } from './date';
import { START_HOUR, TOTAL_SLOTS } from '../constants';

function parseICSDate(str) {
  if (!str) return null;
  const s = str.replace('Z', '').replace(/[:-]/g, '');
  if (s.length === 8) {
    return new Date(
      parseInt(s.slice(0, 4)),
      parseInt(s.slice(4, 6)) - 1,
      parseInt(s.slice(6, 8))
    );
  }
  if (s.length >= 15) {
    return new Date(
      parseInt(s.slice(0, 4)),
      parseInt(s.slice(4, 6)) - 1,
      parseInt(s.slice(6, 8)),
      parseInt(s.slice(9, 11)),
      parseInt(s.slice(11, 13))
    );
  }
  return null;
}

export function parseICS(text) {
  const events = [];
  const lines = text.replace(/\r\n /g, '').replace(/\r\n/g, '\n').split('\n');

  let current = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      current = {};
    } else if (line === 'END:VEVENT' && current) {
      const start = current.start;
      const end = current.end || current.start;

      if (start) {
        const startDate = formatDate(start);
        const endDate = formatDate(end);
        const startH = start.getHours();
        const startM = start.getMinutes();
        const endH = end.getHours();
        const endM = end.getMinutes();

        const startSlot = Math.max(0, (startH - START_HOUR) * 2 + Math.floor(startM / 30));
        const endSlot = Math.min(TOTAL_SLOTS, (endH - START_HOUR) * 2 + Math.ceil(endM / 30));
        const durationSlots = Math.max(1, endSlot - startSlot);

        if (startSlot >= 0 && startSlot < TOTAL_SLOTS) {
          events.push({
            id: current.uid || `ics-${Date.now()}-${events.length}`,
            title: current.summary || '(Geen titel)',
            startDate,
            endDate,
            startSlot,
            durationSlots,
            isCalendarEvent: true,
          });
        }
      }
      current = null;
    } else if (current) {
      const colonIdx = line.indexOf(':');
      if (colonIdx === -1) continue;
      const key = line.slice(0, colonIdx).split(';')[0].toUpperCase();
      const val = line.slice(colonIdx + 1);

      if (key === 'SUMMARY') current.summary = val;
      else if (key === 'UID') current.uid = val;
      else if (key === 'DTSTART') current.start = parseICSDate(val);
      else if (key === 'DTEND') current.end = parseICSDate(val);
    }
  }

  return events;
}
