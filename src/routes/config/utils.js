export function convertTimestampToDate(timestamp) {
   if (!timestamp?.seconds) return 'N/A';
   const date = new Date(timestamp.seconds * 1000);
   return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
   });
}
