import React from 'react';
import { Lock, Unlock } from 'lucide-react';

interface LevelListProps {
  currentLevel: number;
  onSelectLevel: (level: number) => void;
}

const levels = [1, 2, 3, 4];

const LevelList: React.FC<LevelListProps> = ({ currentLevel, onSelectLevel }) => {
  return (
    <div className="flex flex-col bg-gray-800 text-white p-4 px-5 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Ibyicyiro </h3>
      <ul>
        {levels.map((level) => (
          <li
            key={level}
            className={`cursor-pointer p-2 mb-2 rounded flex items-center ${
              level <= currentLevel ? 'bg-blue-500' : 'bg-gray-700 cursor-not-allowed'
            }`}
            onClick={() => level <= currentLevel && onSelectLevel(level)}
          >
            {level <= currentLevel ? (
              <Unlock className="mr-2" />
            ) : (
              <Lock className="mr-2" />
            )}
            Icyiciro {level}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LevelList;