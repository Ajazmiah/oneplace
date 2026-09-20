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

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const validateFile = (file) => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return "Only PDF, DOC, or DOCX files are allowed.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "File must be 5MB or smaller.";
  }
  return null;
};

export const openDocument = (url) => {
  window.open(url, "_blank");
};