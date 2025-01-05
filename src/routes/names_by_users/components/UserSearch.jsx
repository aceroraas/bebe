import React, { useState } from 'react';
import { getUserByName } from '../../../shared/services/namesService';

export const UserSearch = ({ onUserSelected, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setResults([]);
      onClear?.();
      return;
    }

    try {
      setLoading(true);
      const users = await getUserByName(value);
      setResults(users);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex-1">
      <div className="join w-full">
        <input
          type="text"
          placeholder="Buscar usuario..."
          className="input input-bordered join-item w-full"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {loading ? (
          <button className="btn join-item">
            <span className="loading loading-spinner"></span>
          </button>
        ) : (
          <button className="btn join-item">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
          {results.map((user) => (
            <div
              key={user.id}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              onClick={() => {
                onUserSelected(user);
                setSearchTerm('');
                setResults([]);
              }}
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  {user.displayName?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              <span>{user.displayName}</span>
              <span className="text-sm text-gray-500">
                ({user.names?.length || 0} nombres)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
