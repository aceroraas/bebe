import { useState, useEffect, useRef } from 'react';

const CountDownTimer = ({ start, setFinished, children }) => {
   const [count, setCount] = useState(10);
   const [isCompleted, setIsCompleted] = useState(false);
   const intervalRef = useRef(null);

   useEffect(() => {
      // Si `start` es true y no hay un intervalo activo, comenzamos el contador
      if (start && !intervalRef.current) {
         intervalRef.current = setInterval(() => {
            setCount((prev) => {
               if (prev === 0) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                  setIsCompleted(true);
                  return 0;
               }
               return prev - 1;
            });
         }, 1100);
      }

      // Limpiamos el intervalo cuando el componente se desmonta o `start` cambia a false
      return () => {
         if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
         }
      };
   }, [start]);

   useEffect(() => {
      if (isCompleted) {
         setFinished(true); // Actualizamos el estado del padre
      }
   }, [isCompleted, setFinished]);

   if (isCompleted) {
      return <>{[children]}</>;
   }
   return <><span className="countdown font-mono text-[16rem]">
      <span style={{ "--value": count }}></span>
   </span ></>;
};


export default CountDownTimer;