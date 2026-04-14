import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('fr');

const toDayjs = (value?: string | Date | null) => {
  if (!value)
    return null;

  const d = dayjs(value);
  return d.isValid() ? d : null;
};

export const formatHistoryDateAbsolute = (value?: string | Date | null): string => {
  const d = toDayjs(value);
  return d ? d.format('DD MMMM YYYY') : '-';
};

export const formatHistoryDateRelative = (value?: string | Date | null): string => {
  const d = toDayjs(value);
  return d ? d.fromNow() : '-';
};

export const formatHistoryDatePrecise = (value?: string | Date | null): string => {
  const d = toDayjs(value);
  return d ? d.format('DD MMMM YYYY HH:mm') : '-';
};

export const computeDurationLabel = (
  start?: string | Date | null,
  end?: string | Date | null,
): string => {
  const startDate = toDayjs(start);
  const endDate = toDayjs(end);

  if (!startDate || !endDate)
    return '-';

  const totalMinutes = Math.max(0, endDate.diff(startDate, 'minute'));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours && minutes)
    return `${hours}h ${minutes}min`;
  if (hours)
    return `${hours}h`;
  return `${minutes}min`;
};

export const toSortableTimestamp = (value?: string | Date | null): number => {
  const d = toDayjs(value);
  return d ? d.valueOf() : 0;
};
