const option = {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
};

function formatDate(date) {
  return new Intl.DateTimeFormat('id-ID', option).format(new Date(date));
}

export default formatDate;
