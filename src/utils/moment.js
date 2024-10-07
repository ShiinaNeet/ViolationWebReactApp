import moment from 'moment';

function formatDate(date) {
    return moment(date).format('MMMM D, YYYY - h:mma');
}


export default formatDate;