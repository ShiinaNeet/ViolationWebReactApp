import moment from "moment";

function formatDate(date, format) {
  return moment(date).format(format);

  //return moment(date, 'DD-MMM-YYYY HH:mm').format('MMMM D, YYYY - h:mma');
}

export default formatDate;
