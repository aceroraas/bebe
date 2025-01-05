import { useNavigate } from 'react-router-dom';

export const CallToAction = ({
  title,
  description,
  buttonText,
  route,
  icon,
  theme = 'primary' // primary, secondary, accent
}) => {
  const navigate = useNavigate();

  const themeClasses = {
    primary: {
      card: 'bg-primary/10',
      button: 'btn-primary',
      title: 'text-primary-content',
      description: 'text-primary-content/80'
    },
    secondary: {
      card: 'bg-secondary/10',
      button: 'btn-secondary',
      title: 'text-secondary-content',
      description: 'text-secondary-content/80'
    },
    accent: {
      card: 'bg-accent/10',
      button: 'btn-accent',
      title: 'text-accent-content',
      description: 'text-accent-content/80'
    }
  };

  const classes = themeClasses[theme];

  return (
    <div className={`card shadow-lg ${classes.card} transition-all hover:shadow-xl`}>
      <div className="card-body">
        <div className="flex items-center gap-3 mb-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className={`card-title text-xl ${classes.title}`}>{title}</h3>
        </div>
        
        <p className={`${classes.description} mb-4`}>{description}</p>
        
        <div className="card-actions justify-end">
          <button 
            className={`btn ${classes.button}`}
            onClick={() => navigate(route)}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};
