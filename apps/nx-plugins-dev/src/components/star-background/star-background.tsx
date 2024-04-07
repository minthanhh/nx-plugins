/** @jsxImportSource react */

import { Suspense, useRef, useState } from 'react';
import { PointMaterial, Points } from '@react-three/drei';
import { useFrame, Canvas } from '@react-three/fiber';
// @ts-ignore
const inSphere = require('maath/random/dist/maath-random.esm');

function StarBackground() {
  const ref: any = useRef();
  const [sphere] = useState(() => inSphere(new Float32Array(5000), { radius: 1.2 }));

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled>
        <PointMaterial transparent color="$fff" size={0.002} sizeAttenuation={true} dethWrite={false} />
      </Points>
    </group>
  );
}

const StarsCanvas = () => {
  return (
    <div className="w-full h-auto fixed inset-0 z-[20]">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense>
          <StarBackground />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
