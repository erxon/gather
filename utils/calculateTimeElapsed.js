const formatDate = (timeElapsed) => {
  let days = Math.floor(timeElapsed / (1000 * 60 * 60 * 24));
  let hours = Math.floor(
    (timeElapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  let minutes = Math.floor((timeElapsed % (1000 * 60 * 60)) / (1000 * 60));
  return `${days} days, ${hours} hrs, ${minutes} minutes`
};

export default function calculateTimeElapsed(time) {
  const endTime = new Date();
  const startTime = new Date(time);
  const timeElapsed = endTime - startTime;
  const formattedDate = formatDate(timeElapsed);
  return formattedDate;
}
