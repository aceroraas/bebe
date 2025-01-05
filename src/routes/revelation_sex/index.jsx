import React, { useState } from 'react';
import { Header } from './components/Header';
import { RevealButton } from './components/RevealButton';
import { RevealResult } from './components/RevealResult';
import { useConfetti } from '../../shared/hooks/useConfetti';

export default function RevelationSex() {
   const [revealed, setRevealed] = useState(false);
   const [isAnimating, setIsAnimating] = useState(false);
   const { launchConfetti } = useConfetti();
   const handleReveal = () => {
      setIsAnimating(true);
      setTimeout(() => {
         setRevealed(true);
         launchConfetti("girl");
      }, 500);
   };

   return (
      <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-100 flex items-center justify-center p-4">
         <div className="max-w-2xl w-full">
            <Header />
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center relative overflow-hidden">
               {!revealed ? (
                  <RevealButton onReveal={handleReveal} isAnimating={isAnimating} />
               ) : (
                  <RevealResult />
               )}
            </div>
         </div>
      </div>
   );
}


