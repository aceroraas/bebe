import React from 'react';

export const TeamList = ({ team, voters, teamColor }) => (
  <div className={`bg-${teamColor}-100 p-4 rounded-lg shadow-lg`}>
    <h2 className={`text-2xl font-semibold text-${teamColor}-600 text-center mb-4`}>
      Team {team}
    </h2>
    <div className="flex flex-col gap-2">
      {voters.map((voter, index) => (
        <div key={index} className="flex items-center gap-2 bg-white p-2 rounded">
          <img src={voter.photoURL} alt={voter.displayName} className="w-8 h-8 rounded-full" />
          <span className="text-sm">{voter.displayName}</span>
        </div>
      ))}
    </div>
  </div>
);
