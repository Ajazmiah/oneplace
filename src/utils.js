export const formatDate = (date) => {
  const formatDate = (month, day, year) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthName = monthNames[month - 1];
    return `${monthName} ${day}, ${year}`;
  };

  let DATE = new Date(date);

  const month = monthNames[DATE.getMonth()];
  const year = DATE.getFullYear();
  const day = DATE.getDate();

  const formatedDate = `${month} ${day},${year}`;

  return formatedDate;
};
