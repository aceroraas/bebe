/**
 * Comprueba si una fecha es hoy o ya pasó
 * @param {number|Object} timestamp - Timestamp en segundos o objeto Firestore Timestamp
 * @returns {boolean}
 */
export function isRevelationDay(timestamp) {
  if (!timestamp) return false;

  try {
    let seconds;
    
    // Manejar diferentes formatos de timestamp
    if (typeof timestamp === 'object' && timestamp.seconds) {
      seconds = timestamp.seconds;
    } else if (typeof timestamp === 'number') {
      seconds = timestamp;
    } else {
      console.log('Formato de timestamp inválido:', timestamp);
      return false;
    }

    // Obtener el inicio del día actual en segundos (UTC)
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
    
    // Obtener el inicio del día de revelación en segundos (UTC)
    const revDate = new Date(seconds * 1000);
    const revDayStart = new Date(revDate.getFullYear(), revDate.getMonth(), revDate.getDate()).getTime() / 1000;

    // Para debug
    console.log('Timestamp actual (segundos):', Math.floor(now.getTime() / 1000));
    console.log('Timestamp revelación (segundos):', seconds);
    console.log('Inicio día actual (segundos):', todayStart);
    console.log('Inicio día revelación (segundos):', revDayStart);
    
    // Retorna true si la fecha de revelación es hoy o ya pasó
    const result = revDayStart <= todayStart;
    console.log('¿Es día de revelación o ya pasó?:', result);
    
    return result;
  } catch (error) {
    console.error('Error checking revelation day:', error);
    return false;
  }
}
