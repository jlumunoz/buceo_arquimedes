const minimumYear = 1900;
const maximumYear = 9998;
const day = 86400000;

function firstMonday(year) {
  const fourth = Date.UTC(year, 0, 4);
  return fourth - ((new Date(fourth).getUTCDay() + 6) % 7) * day;
}

function groupCourseWeeks(year) {
  const months = Array.from({length: 12}, () => []);
  const end = firstMonday(year + 1);
  const januaryFirst = Date.UTC(year, 0, 1);
  for (let monday = firstMonday(year), week = 1; monday < end; monday += 7 * day, week++) {
    const month = monday < januaryFirst ? 0 : new Date(monday).getUTCMonth();
    months[month].push({week, monday, sunday: monday + 6 * day});
  }
  return months;
}
