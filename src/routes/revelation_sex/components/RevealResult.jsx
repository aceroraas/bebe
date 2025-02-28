import React from 'react';
import { GENDER_CONTENT } from '../../../shared/services/revelacionService';

export function RevealResult({ gender, content }) {
   // Si no se pasa el contenido, usar el contenido por defecto del género
   const displayContent = content || GENDER_CONTENT[gender] || GENDER_CONTENT.none;

   return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8 animate-fade-in">
         <div className={`text-[5rem] ${displayContent.color} animate-bounce`}>
            {displayContent.emoji}
         </div>

         <h1 className={`text-6xl font-bold ${displayContent.color} animate-pulse`}>
            {displayContent.title}
         </h1>

         <p className="text-xl text-gray-600 max-w-md text-center animate-fade-in-up">
            {displayContent.description}
         </p>

         <div className={`mt-8 p-4 rounded-lg ${displayContent.alert} animate-fade-in`}>
            <p className="text-lg font-medium">
               {displayContent.message}
            </p>
         </div>
      </div>
   );
}

function RevealResultComponent({ gender = 'none' }) {
   const content = GENDER_CONTENT[gender] || GENDER_CONTENT.none;

   return (
      <RevealResult gender={gender} content={content} />
   );
}
