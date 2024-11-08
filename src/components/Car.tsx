import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const CarModel: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url);

  // Rotate the car to look upward
  scene.rotation.x = -Math.PI / 2; // Rotate 90 degrees upward (in radians)
  scene.rotation.z = -Math.PI / 1;
  // Scale the car down to a smaller size
  scene.scale.set(0.006, 0.005, 0.006); // Adjust the scale for a smaller appearance

  // Change the color of the car material
  scene.traverse((child: any) => {
    if (child.isMesh) {
      child.material.color.set('#FF5733'); // Set to a custom color, e.g., orange-red
    }
  });

  return <primitive object={scene} />;
};

const ThreeDCar: React.FC = () => {
  return (
    <Canvas className='absolute bottom-0 left-0' style={{ height: '100vh' }} camera={{ position: [0, 0, 30], fov: 50 }}>
      <ambientLight />
      <pointLight position={[-10, -10, -10]} />
      <CarModel url="/models/car/scene.gltf" />
     {/* <OrbitControls />  Added OrbitControls */}
    </Canvas>
  );
};

export default ThreeDCar;
