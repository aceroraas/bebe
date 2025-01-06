import JSConfetti from 'js-confetti';

export function useConfetti() {
   const jsConfetti = new JSConfetti();

   const launchConfetti = ({ type = 'girl' } = {}) => {
      const colors = type === 'boy' 
         ? ['#1e40af', '#3b82f6', '#93c5fd', '#dbeafe', '#ffffff'] // Azules y blanco para niño
         : ['#be185d', '#ec4899', '#f9a8d4', '#fce7f3', '#ffffff'];  // Rosas y blanco para niña

      jsConfetti.addConfetti({
         confettiColors: colors,
         confettiNumber: 200,
      });
   };

   return { launchConfetti };
}