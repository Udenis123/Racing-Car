// Fireworks.tsx
import React from 'react';
import Confetti from 'react-confetti';

interface FireworksProps {
  run: boolean;
}

const Fireworks: React.FC<FireworksProps> = ({ run }) => {
  return run ? <Confetti width={window.innerWidth} height={window.innerHeight} /> : null;
};

export default Fireworks;