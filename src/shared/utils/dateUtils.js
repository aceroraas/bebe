/**
 * Comprueba si una fecha dada es hoy o posterior
 * @param {number} timestamp - Timestamp en segundos
 * @returns {boolean}
 */
export function isRevelationDay(timestamp) {
  if (!timestamp || typeof timestamp !== 'number') {
    return false;
  }

  try {
    // Validar que el timestamp esté en un rango razonable
    const minDate = new Date('2024-01-01').getTime() / 1000;
    const maxDate = new Date('2026-12-31').getTime() / 1000;
    
    if (timestamp < minDate || timestamp > maxDate) {
      return false;
    }

    // Obtener fecha actual en UTC
    const now = new Date();
    const today = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    ));
    
    // Convertir el timestamp a fecha UTC
    const revDate = new Date(timestamp * 1000);
    const revelationDay = new Date(Date.UTC(
      revDate.getUTCFullYear(),
      revDate.getUTCMonth(),
      revDate.getUTCDate()
    ));
    
    // Validar que la fecha sea válida
    if (isNaN(revelationDay.getTime())) {
      return false;
    }
    
    return today.getTime() >= revelationDay.getTime();
  } catch (error) {
    return false;
  }
}
