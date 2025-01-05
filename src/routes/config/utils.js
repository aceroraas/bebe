export function convertTimestampToDate(timestamp) {
   if (!timestamp) return 'N/A';
   const date = new Date((timestamp.seconds + timestamp.nanoseconds / 1e9) * 1000);
   date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Ajustar la zona horaria
   return date.toLocaleDateString('es-ES');
}
