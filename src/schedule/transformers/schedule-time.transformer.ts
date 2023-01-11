export function transformScheduleTime(value: string) {
  const parsedValue = value.trim().toUpperCase();

  const [time, period] = parsedValue.split(' ');
  const [hours] = time?.split(':');

  return `${+hours < 10 ? `0${+hours}` : hours}:00 ${period}`;
}
