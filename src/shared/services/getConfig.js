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
const CACHE_EXPIRATION = 1000 * 60 * 60 * 24; // 1 hora en milisegundos

export function useConfigData() {
   const [config, setConfig] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const getCachedConfig = () => {
         const cached = localStorage.getItem(CACHE_KEY);
         if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            const now = Date.now();
            if (now - timestamp < CACHE_EXPIRATION) {
               return data;
            }
         }
         return null;
      };

      const fetchAndCacheConfig = async () => {
         try {
            const data = await getConfig();
            const cacheData = {
               data,
               timestamp: Date.now()
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
            setConfig(data);
         } catch (err) {
            setError(err);
         } finally {
            setLoading(false);
         }
      };

      const cachedConfig = getCachedConfig();
      if (cachedConfig) {
         setConfig(cachedConfig);
         setLoading(false);
      } else {
         fetchAndCacheConfig();
      }
   }, []);

   return { config, loading, error };
}
