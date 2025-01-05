import { useNavigate } from 'react-router-dom';

const NEXT_STEPS = {
  VOTE: {
    title: '¡Elige tu Team!',
    description: '¿Será niño o niña? ¡Únete a esta emocionante aventura y registra tu predicción!',
    buttonText: 'Elegir Team',
    route: '/votacion',
    theme: 'primary',
    icon: '🎯'
  }
};

export const NextStepCard = () => {
  const navigate = useNavigate();

  const stepConfig = NEXT_STEPS.VOTE;
  const themeColors = {
    primary: 'from-pink-50 to-blue-50 hover:from-pink-100 hover:to-blue-100'
  };

  return (
    <div className={`card shadow-xl transition-all duration-300 bg-gradient-to-r ${themeColors[stepConfig.theme]}`}>
      <div className="card-body">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{stepConfig.icon}</span>
          <h3 className="card-title text-2xl">{stepConfig.title}</h3>
        </div>
        
        <p className="text-gray-600 mb-6">{stepConfig.description}</p>
        
        <div className="card-actions justify-end">
          <button 
            className={`btn btn-lg gap-2 btn-primary`}
            onClick={() => navigate(stepConfig.route)}
          >
            {stepConfig.buttonText}
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
