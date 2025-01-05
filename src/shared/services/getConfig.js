import { collection, getDocs } from "firebase/firestore";
import { db } from '../services/firebaseConfig';
import { useState, useEffect } from 'react';

// Singleton para mantener una única instancia de los datos
let configInstance = null;
let lastFetch = 0;
const REFRESH_INTERVAL = 60000; // 1 minuto
let activeSubscribers = 0;
let refreshTimeout = null;

/**
 * Obtiene la configuración de Firestore
 * @returns {Promise<Array>} Lista de configuraciones
 */
async function fetchConfig() {
  try {
    const configRef = collection(db, 'configuracion');
    const querySnapshot = await getDocs(configRef);
    
    if (querySnapshot.empty) {
      return [];
    }

    return querySnapshot.docs.map((doc) => ({ 
      item: doc.id, 
      data: doc.data() 
    }));
  } catch (error) {
    console.error('Error fetching config:', error);
    throw error;
  }
}

/**
 * Refresca los datos si es necesario
 * @returns {Promise<Array>} Datos actualizados
 */
async function refreshIfNeeded() {
  const now = Date.now();
  
  // Si no hay datos o ha pasado el intervalo de refresco
  if (!configInstance || (now - lastFetch) > REFRESH_INTERVAL) {
    configInstance = await fetchConfig();
    lastFetch = now;
  }
  
  return configInstance;
}

/**
 * Hook para usar la configuración con refresco automático
 * @returns {{ config: Array, loading: boolean, error: Error|null }}
 */
export function useConfig() {
  const [config, setConfig] = useState(configInstance);
  const [loading, setLoading] = useState(!configInstance);
  const [error, setError] = useState(null);

  useEffect(() => {
    activeSubscribers++;
    let mounted = true;

    const updateConfig = async () => {
      if (!mounted) return;
      
      try {
        setLoading(true);
        const data = await refreshIfNeeded();
        if (mounted) {
          setConfig(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Primera carga
    updateConfig();

    // Configurar refresco periódico
    if (!refreshTimeout) {
      refreshTimeout = setInterval(() => {
        if (activeSubscribers > 0) {
          updateConfig();
        }
      }, REFRESH_INTERVAL);
    }

    return () => {
      mounted = false;
      activeSubscribers--;
      
      // Limpiar intervalo si no hay más suscriptores
      if (activeSubscribers === 0 && refreshTimeout) {
        clearInterval(refreshTimeout);
        refreshTimeout = null;
      }
    };
  }, []);

  return { config, loading, error };
}
