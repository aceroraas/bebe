import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import RevealButton from './components/RevealButton';
import { RevealResult } from './components/RevealResult';
import { CorrectVoters } from './components/CorrectVoters';
import { useConfetti } from '../../shared/hooks/useConfetti';
import { getRevelacionData, getCorrectVoters } from '../../shared/services/revelacionService';

export default function RevelationSex() {
   const [revealed, setRevealed] = useState(false);
   const [isAnimating, setIsAnimating] = useState(false);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [gender, setGender] = useState('none');
   const [content, setContent] = useState(null);
   const [correctVoters, setCorrectVoters] = useState([]);
   const { launchConfetti } = useConfetti();

   useEffect(() => {
      loadGenderData();
   }, []);

   const loadGenderData = async () => {
      try {
         setLoading(true);
         const data = await getRevelacionData();
         console.log('Datos cargados en revelación:', data);
         
         if (data && data.gender) {
            console.log('Género cargado:', data.gender);
            setGender(data.gender);
            setContent(data.content);
            
            if (data.gender !== 'none') {
               const voters = await getCorrectVoters(data.gender);
               setCorrectVoters(voters);
            }
         } else {
            console.log('No se encontró género, usando none');
            setGender('none');
         }
         setRevealed(false);
      } catch (err) {
         console.error('Error al cargar el género:', err);
         setError('Error al cargar los datos. Por favor, recarga la página.');
      } finally {
         setLoading(false);
      }
   };

   const handleReveal = async () => {
      if (gender === 'none') return;
      
      setIsAnimating(true);
      setTimeout(async () => {
         setRevealed(true);
         launchConfetti(gender);
         
         // Cargar los votantes correctos después de revelar
         try {
            const voters = await getCorrectVoters(gender);
            setCorrectVoters(voters);
         } catch (error) {
            console.error('Error al cargar votantes:', error);
         }
      }, 500);
   };

   if (loading) {
      return (
         <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="loading loading-spinner loading-lg"></div>
         </div>
      );
   }

   if (error) {
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

   if (!content) {
      return (
         <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="loading loading-spinner loading-lg"></div>
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

   return (
      <div className={`min-h-screen bg-gradient-to-b ${gradientClass} transition-all duration-500 flex items-center justify-center p-4`}>
         <div className="max-w-2xl w-full">
            <Header />
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center relative overflow-hidden">
               {!revealed ? (
                  <RevealButton 
                     onReveal={handleReveal} 
                     isAnimating={isAnimating} 
                     isEnabled={gender !== 'none'}
                     gender={gender}
                  />
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
