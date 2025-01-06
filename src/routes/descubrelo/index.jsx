import React, { useState, useEffect } from 'react';
import { useAuth } from '../../shared/hooks/useAuth';
import { LetterBox } from './components/LetterBox';
import { LetterInput } from './components/LetterInput';
import { LoginPrompt } from '../../shared/components/LoginPrompt';
import { getBabyInfo, subscribeToGameState, guessLetter } from '../../shared/services/babyNameService';
import { getRevelacionData } from '../../shared/services/revelacionService';
import { useConfetti } from '../../shared/hooks/useConfetti';
import { isRevelationDay } from '../../shared/utils/dateUtils';
import { useConfig } from '../../shared/services/getConfig';

export default function Descubrelo() {
  const { currentUser } = useAuth();
  const { launchConfetti } = useConfetti();
  const { config, loading: configLoading } = useConfig();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [babyInfo, setBabyInfo] = useState(null);
  const [gameState, setGameState] = useState({ letters: { first_name: {}, second_name: {} }, users: {} });
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gender, setGender] = useState('');

  useEffect(() => {
    if (!configLoading) {
      loadInitialData();
    }
  }, [configLoading]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Verificar si ya es el día de la revelación
      const metadata = config?.find(conf => conf.item === 'metadata')?.data;
      
      if (!metadata?.revelationDay?.seconds) {
        setError('El juego estará disponible el día de la revelación');
        return;
      }

      // Verificar si el género ya fue revelado
      const revelacionData = await getRevelacionData();
      if (!revelacionData || revelacionData.gender === 'none') {
        setError('El género aún no ha sido revelado');
        return;
      }

      const timestamp = metadata.revelationDay.seconds;
      
      // Validar el timestamp
      if (typeof timestamp !== 'number' || isNaN(timestamp)) {
        setError('El juego estará disponible el día de la revelación');
        return;
      }

      // Crear fecha usando el timestamp
      const revDate = new Date(timestamp * 1000);
      
      // Validar que la fecha sea válida
      if (isNaN(revDate.getTime())) {
        setError('El juego estará disponible el día de la revelación');
        return;
      }
      
      // Formatear la fecha
      const formatDate = (date) => {
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
      };

      const revDayStr = formatDate(revDate);
      
      if (!isRevelationDay(metadata.revelationDay)) {
        setError(`El juego estará disponible el ${revDayStr}`);
        return;
      }

      setGender(revelacionData.gender);

      // Cargar información del bebé
      const info = await getBabyInfo(revelacionData.gender);
      setBabyInfo(info);

      // Suscribirse a cambios en el estado del juego
      const unsubscribe = subscribeToGameState((state) => {
        setGameState(state);
        checkGameCompletion(state.letters, info);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error en loadInitialData:', error);
      setError('Error al cargar los datos. Por favor, recarga la página.');
    } finally {
      setLoading(false);
    }
  };

  const checkGameCompletion = (letters, info) => {
    if (!info) return;
    
    const firstNameComplete = info.first_name.split('').every(
      letter => letters.first_name[letter.toUpperCase()]
    );
    
    const secondNameComplete = info.second_name.split('').every(
      letter => letters.second_name[letter.toUpperCase()]
    );

    const isNowComplete = firstNameComplete && secondNameComplete;
    if (isNowComplete && !gameCompleted) {
      // Convertir el género al formato que espera el confeti (boy/girl)
      const confettiType = gender === 'boy' ? 'boy' : 'girl';
      launchConfetti({ type: confettiType });
    }
    setGameCompleted(isNowComplete);
  };

  const findNextPosition = () => {
    if (!babyInfo) return null;

    // Primero buscar en el primer nombre
    const firstNamePosition = babyInfo.first_name.split('').findIndex((letter, index) => {
      const upperLetter = letter.toUpperCase();
      return !gameState.letters.first_name?.[upperLetter];
    });

    if (firstNamePosition !== -1) {
      return { type: 'first_name', position: firstNamePosition };
    }

    // Si no hay posiciones en el primer nombre, buscar en el segundo
    const secondNamePosition = babyInfo.second_name.split('').findIndex((letter, index) => {
      const upperLetter = letter.toUpperCase();
      return !gameState.letters.second_name?.[upperLetter];
    });

    if (secondNamePosition !== -1) {
      return { type: 'second_name', position: secondNamePosition };
    }

    return null;
  };

  const handleGuess = async (letter, nameType, position) => {
    if (!currentUser) return;
    
    try {
      await guessLetter(letter.toUpperCase(), nameType, currentUser.uid, position);
    } catch (error) {
      if (error.message === 'La letra no coincide en esta posición') {
        alert('¡Ups! La letra no coincide en esta posición. ¡Sigue intentando!');
      } else {
        alert(error.message || 'Error al intentar adivinar la letra');
      }
    }
  };

  const renderName = (name, type) => {
    if (!name) return null;

    const bgColor = gender === 'boy' ? 'bg-blue-50' : 'bg-pink-50';
    const borderColor = gender === 'boy' ? 'border-blue-200' : 'border-pink-200';

    return (
      <div className={`flex flex-col items-center gap-4 ${bgColor} p-6 rounded-lg shadow-md border-2 ${borderColor}`}>
        <h3 className="text-xl font-medium text-gray-800">
          {type === 'first_name' ? 'Primer Nombre' : 'Segundo Nombre'}
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {name.split('').map((letter, index) => {
            const upperLetter = letter.toUpperCase();
            const guesserId = gameState.letters[type]?.[upperLetter];
            const guesserData = gameState.users[guesserId];
            return (
              <div key={index} className="flex flex-col items-center">
                <LetterBox
                  letter={upperLetter}
                  revealed={!!guesserId}
                  guesserPhotoURL={guesserData?.photoURL}
                  guesserName={guesserData?.displayName}
                  gender={gender}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
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
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const nextPosition = findNextPosition();
  const textColor = gender === 'boy' ? 'text-blue-600' : 'text-pink-600';
  const bgColor = gender === 'boy' ? 'bg-blue-50' : 'bg-pink-50';
  const borderColor = gender === 'boy' ? 'border-blue-200' : 'border-pink-200';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold ${textColor} mb-2`}>¡Descubre el Nombre!</h2>
          {!currentUser && !gameCompleted && (
            <div className="max-w-lg mx-auto mt-4">
              <div className="alert alert-info mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Inicia sesión para participar en el juego</span>
              </div>
              <LoginPrompt message="¡Únete al juego y ayuda a descubrir el nombre!" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8">
          {renderName(babyInfo?.first_name, 'first_name')}
          {renderName(babyInfo?.second_name, 'second_name')}
        </div>

        {currentUser && !gameCompleted && nextPosition && (
          <div className="mt-8 max-w-xs mx-auto text-center">
            <p className={`text-sm ${textColor} mb-2`}>
              Adivina la letra en la posición {nextPosition.position + 1} del {nextPosition.type === 'first_name' ? 'primer' : 'segundo'} nombre
            </p>
            <LetterInput
              onGuess={(letter) => handleGuess(letter, nextPosition.type, nextPosition.position)}
              disabled={gameCompleted}
              gender={gender}
            />
          </div>
        )}

        {gameCompleted && (
          <div className={`mt-8 text-center ${bgColor} p-6 rounded-lg shadow-md border-2 ${borderColor}`}>
            <h3 className={`text-2xl font-bold ${textColor}`}>¡Felicitaciones!</h3>
            <p className="text-lg text-gray-600 mt-2">Han descubierto el nombre completo:</p>
            <p className={`text-3xl font-bold ${textColor} mt-4`}>
              {babyInfo.first_name} {babyInfo.second_name}
            </p>
            <p className="text-gray-600 italic mt-6">
              {babyInfo.meaning}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}