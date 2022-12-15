export const relativeDate = ({ dateToCheck, currentDate, locale }) => {
  const todayYear = new Date(currentDate).getFullYear();
  const transactionsYear = new Date(dateToCheck).getFullYear();
  const todayDate = new Date(currentDate).getDate();
  const todayMonth = new Date(currentDate).getMonth();
  const transactionDate = new Date(dateToCheck).getDate();
  const transactionMonth = new Date(dateToCheck).getMonth();

  switch (true) {
    case todayYear === transactionsYear &&
      todayMonth === transactionMonth &&
      todayDate - transactionDate === 0:
      return "Today";
    case todayYear === transactionsYear &&
      todayMonth === transactionMonth &&
      todayDate - transactionDate === 1:
      return "Yesterday";
    case todayYear === transactionsYear &&
      todayMonth === transactionMonth &&
      todayDate - transactionDate === 2:
      return new Date(dateToCheck).toLocaleDateString(locale, {
        weekday: "long",
      });
    case todayYear === transactionsYear &&
      todayMonth === transactionMonth &&
      todayDate - transactionDate === 3:
      return new Date(dateToCheck).toLocaleDateString(locale, {
        weekday: "long",
      });
    case todayYear === transactionsYear &&
      todayMonth === transactionMonth &&
      todayDate - transactionDate === 4:
      return new Date(dateToCheck).toLocaleDateString(locale, {
        weekday: "long",
      });
    case todayYear === transactionsYear &&
      todayMonth === transactionMonth &&
      todayDate - transactionDate === 5:
      return new Date(dateToCheck).toLocaleDateString(locale, {
        weekday: "long",
      });
    case todayYear === transactionsYear &&
      todayMonth === transactionMonth &&
      todayDate - transactionDate === 6:
      return new Date(dateToCheck).toLocaleDateString(locale, {
        weekday: "long",
      });
    case todayYear === transactionsYear &&
      todayMonth === transactionMonth &&
      todayDate - transactionDate === 7:
      return new Date(dateToCheck).toLocaleDateString(locale, {
        weekday: "long",
      });
    case todayYear === transactionsYear &&
      todayMonth === transactionMonth &&
      todayDate - transactionDate > 7 &&
      todayDate - transactionDate <= 31:
      return `${new Date(dateToCheck).toLocaleDateString(locale, {
        month: "long",
      })} ${new Date(dateToCheck).getDate()}`;
    default:
      return `${new Date(dateToCheck).toLocaleDateString(locale, {
        month: "long",
      })}, ${new Date(dateToCheck).toLocaleDateString(locale, {
        day: "2-digit",
        year: "numeric",
      })}`;
  }
};
