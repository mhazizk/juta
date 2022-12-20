// Exports a function that calculates the daily limit
export const dailyLimit = ({ limit, spent, startDate, finishDate }) => {
  return (limit - spent) / ((finishDate - startDate) / (1000 * 60 * 60 * 24));
};
