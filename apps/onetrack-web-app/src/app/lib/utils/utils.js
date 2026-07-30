export const formatDate = (date) => {


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



  let DATE = new Date(date);

  const month = monthNames[DATE.getMonth()];
  const year = DATE.getFullYear();
  const day = DATE.getDate();

  const formatedDate = `${month} ${day},${year}`;

  return formatedDate;
};

export const getBuffer = async (file) => {
  return Buffer.from(await file.arrayBuffer());
};

export const openDocument = (url) => {
  window.open(url, "_blank");
};