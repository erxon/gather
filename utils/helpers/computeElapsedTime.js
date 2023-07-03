export default function computeElapsedTime(date) {
  // Online Javascript Editor for free
  // Write, Edit and Run your Javascript code using JS Online Compiler
  const startDate = new Date(date);
  const endDate = new Date();
  const timeElapsed = endDate - startDate;

  let displayTime;


  const seconds = Math.round(timeElapsed / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  console.log(seconds, minutes, hours, days);
  if (minutes <= 0) {
    displayTime = "recently";
  } else if (minutes > 0 && minutes < 60) {
    displayTime = `${minutes}m ago`;
  } else if (minutes >= 60 && minutes < 1440) {
    displayTime = `${hours}h ago`;
  } else if (minutes >= 1440 && minutes < 1440 * 10) {
    displayTime = `${days}d ago`;
  } else {
    displayTime = `${startDate.toDateString()}, at ${startDate.toLocaleTimeString()}`;
  }

  return displayTime;
}
