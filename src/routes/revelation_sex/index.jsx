import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import RevealButton from './components/RevealButton';
import { RevealResult } from './components/RevealResult';
import { CorrectVoters } from './components/CorrectVoters';
import { useConfetti } from '../../shared/hooks/useConfetti';
import { getRevelacionData, getCorrectVoters } from '../../shared/services/revelacionService';
import { useConfig } from '../../shared/services/getConfig';

export default function RevelationSex() {
   const [revealed, setRevealed] = useState(false);
   const [isAnimating, setIsAnimating] = useState(false);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [gender, setGender] = useState('none');
   const [content, setContent] = useState(null);
   const [correctVoters, setCorrectVoters] = useState([]);
   const { launchConfetti } = useConfetti();
   const { config, loading: configLoading } = useConfig();

   useEffect(() => {
      const loadGender = async () => {
         try {
            setLoading(true);
            
            const metadata = config?.find(conf => conf.item === 'metadata')?.data;
            if (!metadata?.revelationDay?.seconds) {
               setError('Cuenta Regresiva para la Revelación\ndías');
               return;
            }

            const now = new Date('2025-01-06T02:47:59-04:00');
            const revDate = new Date(metadata.revelationDay.seconds * 1000);
            
            // Resetear las horas para comparar solo fechas
            const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const revDateOnly = new Date(revDate.getFullYear(), revDate.getMonth(), revDate.getDate());
            
            console.log('Now:', nowDate.toISOString());
            console.log('RevDate:', revDateOnly.toISOString());
            console.log('¿Son iguales?:', nowDate.getTime() === revDateOnly.getTime());

            // Si es el mismo día, mostrar el botón
            if (nowDate.getTime() === revDateOnly.getTime()) {
               console.log('Es el mismo día, mostrando botón');
               const data = await getRevelacionData();
               if (data && data.gender) {
                  setGender(data.gender);
                  setContent(data.content);
               } else {
                  setGender('none');
               }
               setError(null);
               setLoading(false);
               return;
            }

            // Si no es el mismo día, mostrar cuenta regresiva
            const diffTime = revDateOnly.getTime() - nowDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const weeks = Math.floor(diffDays / 7);
            const days = diffDays % 7;

            console.log('DiffDays:', diffDays);
            console.log('Weeks:', weeks);
            console.log('Days:', days);
            
            setError({
               title: 'Cuenta Regresiva para la Revelación',
               weeks,
               days,
               date: revDate.toLocaleDateString()
            });
            setLoading(false);
         } catch (err) {
            console.error('Error al cargar los datos:', err);
            setError('Error al cargar los datos. Por favor, recarga la página.');
            setLoading(false);
         }
      };

      if (!configLoading) {
         loadGender();
      }
   }, [configLoading, config]);

   useEffect(() => {
      const loadVoters = async () => {
         if (gender === 'none') return;
         
         try {
            const voters = await getCorrectVoters(gender);
            setCorrectVoters(voters);
         } catch (error) {
            console.error('Error al cargar votantes:', error);
            setError('Error al cargar la lista de votantes');
         }
      };

      loadVoters();
   }, [gender]);

   const handleReveal = async () => {
      if (gender === 'none') return;
      
      setIsAnimating(true);
      setTimeout(async () => {
         setRevealed(true);
         launchConfetti({ type: gender === 'boy' ? 'boy' : 'girl' });
      }, 500);
   };

   if (loading || configLoading) {
      return (
         <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="loading loading-spinner loading-lg"></div>
         </div>
      );
   }

   if (error) {
      if (typeof error === 'object') {
         // No mostrar la cuenta regresiva si ambos son 0
         if (error.weeks === 0 && error.days === 0) {
            return null;
         }

         return (
            <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center min-h-[400px] space-y-8">
               <h2 className="text-3xl font-bold text-gray-800">
                  {error.title}
               </h2>

               <div className="flex flex-col items-center gap-4 text-2xl">
                  <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
                     {error.weeks > 0 && (
                        <div className="flex flex-col p-2 bg-white rounded-box text-gray-800 shadow-md">
                           <span className="countdown font-mono text-5xl">
                              <span style={{ "--value": error.weeks }}></span>
                           </span>
                           semanas
                        </div>
                     )}
                     {error.days > 0 && (
                        <div className="flex flex-col p-2 bg-white rounded-box text-gray-800 shadow-md">
                           <span className="countdown font-mono text-5xl">
                              <span style={{ "--value": error.days }}></span>
                           </span>
                           días
                        </div>
                     )}
                  </div>

                  <p className="text-lg text-gray-600 mt-4">
                     La revelación estará disponible el {error.date}
                  </p>
               </div>
            </div>
         );
      }

      return (
         <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="alert alert-error">
               <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <span>{error}</span>
            </div>
         </div>
      );
   }

   const gradientClass = revealed ? (
      gender === 'boy' 
         ? 'from-blue-100 to-blue-200' 
         : gender === 'girl' 
            ? 'from-pink-100 to-pink-200' 
            : 'from-gray-100 to-gray-200'
   ) : 'from-gray-100 to-gray-200';

   // Si no hay error y hay contenido, mostrar el botón
   const showButton = !error && content !== null;

   return (
      <div className={`min-h-screen bg-gradient-to-b ${gradientClass} transition-all duration-500 flex items-center justify-center p-4`}>
         <div className="max-w-2xl w-full">
            <Header />
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center relative overflow-hidden">
               {!revealed ? (
                  showButton ? (
                     <RevealButton 
                        onReveal={handleReveal} 
                        isAnimating={isAnimating} 
                        isEnabled={gender !== 'none'}
                        gender={gender}
                     />
                  ) : null
               ) : (
                  <>
                     <RevealResult gender={gender} content={content} />
                     <CorrectVoters voters={correctVoters} />
                  </>
               )}
            </div>
         </div>
      </div>
   );
}
