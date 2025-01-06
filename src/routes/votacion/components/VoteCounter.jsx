export const VoteCounter = ({ girlVotes, boyVotes }) => {
  const totalVotes = girlVotes + boyVotes;
  const girlPercentage = totalVotes > 0 ? (girlVotes / totalVotes) * 100 : 0;
  const boyPercentage = totalVotes > 0 ? (boyVotes / totalVotes) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-center mb-6">Estado de la Votación</h2>
      
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="w-full h-6 bg-blue-400 rounded-full overflow-hidden">
          <div
            className="h-full bg-pink-400 transition-all duration-500"
            style={{ width: `${girlPercentage}%` }}
          />
        </div>

        {/* Vote Counts */}
        <div className="flex justify-between items-center">
          <div className="text-center">
            <span className="text-pink-500 font-bold text-xl">{girlVotes}</span>
            <p className="text-sm text-gray-600">Team Niña</p>
          </div>
          
          <div className="text-center">
            <span className="font-bold text-xl">{totalVotes}</span>
            <p className="text-sm text-gray-600">Total</p>
          </div>

          <div className="text-center">
            <span className="text-blue-500 font-bold text-xl">{boyVotes}</span>
            <p className="text-sm text-gray-600">Team Niño</p>
          </div>
        </div>

        {/* Percentages */}
        <div className="flex justify-between text-sm text-gray-500">
          <span>{girlPercentage.toFixed(1)}%</span>
          <span>{boyPercentage.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};
