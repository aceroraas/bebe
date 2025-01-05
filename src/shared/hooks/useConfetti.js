import confetti from 'canvas-confetti';

export function useConfetti() {
   const launchConfetti = (type = 'girl') => {
      const count = 200;
      const defaults = {
         origin: { y: 0.7 },
         colors: type === 'boy' 
            ? ['#3b82f6', '#60a5fa', '#93c5fd'] // Azules para niño
            : ['#ec4899', '#f472b6', '#f9a8d4']  // Rosas para niña
      };

      function fire(particleRatio, opts) {
         confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
         });
      }

      fire(0.25, {
         spread: 26,
         startVelocity: 55,
      });

      fire(0.2, {
         spread: 60,
      });

      fire(0.35, {
         spread: 100,
         decay: 0.91,
         scalar: 0.8
      });

      fire(0.1, {
         spread: 120,
         startVelocity: 25,
         decay: 0.92,
         scalar: 1.2
      });

      fire(0.1, {
         spread: 120,
         startVelocity: 45,
      });
   };

   return { launchConfetti };
}