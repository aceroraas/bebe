/**
 * Comprueba si una fecha dada es hoy
 * @param {string|Date} date - Fecha a comprobar
 * @returns {boolean}
 */
export const isRevelationDay = (date) => {
  const today = new Date();
  const revelationDate = new Date(date);
  
  return (
    today.getFullYear() === revelationDate.getFullYear() &&
    today.getMonth() === revelationDate.getMonth() &&
    today.getDate() === revelationDate.getDate()
  );
};
