import { useNavigate } from 'react-router-dom';

const NEXT_STEPS = {
  VOTE: {
    title: '¡Ya empezamos!',
    description: '¿Será niño o niña? ¡Únete a esta emocionante aventura ve la revelacion en tiempo real con nosotros!',
    buttonText: 'VER EN TIKTOK LIVE!',
    route: 'https://www.tiktok.com/@aceroraas/live',
    external: true,
    theme: 'primary',
    icon: '📡'
  }
};

export const NextStepCard = () => {
  const navigate = useNavigate();

  const stepConfig = NEXT_STEPS.VOTE;
  const themeColors = {
    primary: 'from-pink-50 to-blue-50 hover:from-pink-100 hover:to-blue-100'
  };
  const handleRouteChange = () => {
    if (stepConfig.external) {
      window.open(stepConfig.route, '_blank');
    } else {
      navigate(stepConfig.route);
    }
  }

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
            onClick={handleRouteChange}
          >
            {stepConfig.buttonText}
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
