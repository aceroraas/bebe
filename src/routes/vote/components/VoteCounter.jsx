export const VoteCounter = ({ girlVotes, boyVotes }) => {
  const total = girlVotes + boyVotes;
  const girlPercentage = total > 0 ? Math.round((girlVotes / total) * 100) : 0;
  const boyPercentage = total > 0 ? Math.round((boyVotes / total) * 100) : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
        Resultados Actuales
      </h2>
      
      <div className="flex justify-between items-center mb-2">
        <div className="text-pink-500 font-bold">Team Niña</div>
        <div className="text-blue-500 font-bold">Team Niño</div>
      </div>

      {/* Barra de progreso */}
      <div className="h-6 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-blue-500"
          style={{
            backgroundSize: `${total === 0 ? 100 : 200}% 100%`,
            backgroundPosition: `${total === 0 ? 50 : girlPercentage}% 0`,
          }}
        />
      </div>

      <div className="flex justify-between text-gray-600">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-pink-500">{girlVotes}</span>
          <span className="text-sm">({girlPercentage}%)</span>
        </div>
        <div className="text-center">
          <span className="text-lg font-semibold">Total: {total}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold text-blue-500">{boyVotes}</span>
          <span className="text-sm">({boyPercentage}%)</span>
        </div>
      </div>
    </div>
  );
};
