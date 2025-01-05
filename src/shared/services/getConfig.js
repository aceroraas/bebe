import { collection, getDocs } from "firebase/firestore";
import { db } from '../../../firebaseConfig';

export async function getConfig() {
   // obtener los documentos de la colección con nombres de cada documento
   const configRef = collection(db, 'configuracion');
   const querySnapshot = await getDocs(configRef);
   if (querySnapshot.empty) {
      return [];
   }
   const configuraciones = await querySnapshot.docs.map((doc) => { return { item: doc.id, data: doc.data() } });
   return configuraciones;
}

// Custom hook simple
import { useState, useEffect } from 'react';

const CACHE_KEY = 'app_config';
const CACHE_EXPIRATION = 1000 * 60 * 60 * 24; // 24 horas en milisegundos

export function useConfigData() {
   const [config, setConfig] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      let isMounted = true;

      const getCachedConfig = () => {
         try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
               const { data, timestamp } = JSON.parse(cached);
               const now = Date.now();
               if (now - timestamp < CACHE_EXPIRATION) {
                  return { data, isValid: true };
               }
            }
         } catch (err) {
            console.error('Error reading cache:', err);
         }
         return { data: null, isValid: false };
      };

      const fetchAndCacheConfig = async () => {
         try {
            const data = await getConfig();
            if (!isMounted) return;

            const cacheData = {
               data,
               timestamp: Date.now()
            };

            try {
               localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
            } catch (err) {
               console.error('Error saving to cache:', err);
            }

            setConfig(data);
            setError(null);
         } catch (err) {
            if (!isMounted) return;
            console.error('Error fetching config:', err);
            setError(err);

            // Si hay error al obtener datos nuevos, intentamos usar la caché expirada como fallback
            const { data } = getCachedConfig();
            if (data) {
               setConfig(data);
            }
         } finally {
            if (isMounted) {
               setLoading(false);
            }
         }
      };

      const init = async () => {
         const { data, isValid } = getCachedConfig();

         if (isValid) {
            setConfig(data);
            setLoading(false);
            // Fetch en segundo plano para mantener datos frescos
            fetchAndCacheConfig();
         } else {
            // Si no hay caché válida, fetch inmediato
            fetchAndCacheConfig();
         }
      };

      init();

      return () => {
         isMounted = false;
      };
   }, []);

   return { config, loading, error };
}
