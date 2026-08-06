import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// 1. Animated Undulating 3D Farmland Terrain & Crop Grid
const FarmlandTerrain = () => {
  const terrainRef = useRef();

  useFrame(({ clock }) => {
    if (terrainRef.current) {
      const position = terrainRef.current.geometry.attributes.position;
      const t = clock.getElapsedTime();
      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        // Create rolling crop ridges & subtle wind animation
        const z = Math.sin(x * 0.4 + t * 0.8) * 0.15 + Math.cos(y * 0.4 + t * 0.5) * 0.15;
        position.setZ(i, z);
      }
      terrainRef.current.geometry.computeVertexNormals();
      position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -2.5, 0]} rotation={[-Math.PI / 2.5, 0, 0]}>
      {/* Soil Plane */}
      <mesh ref={terrainRef} receiveShadow>
        <planeGeometry args={[30, 30, 32, 32]} />
        <meshStandardMaterial
          color="#15803d"
          roughness={0.8}
          metalness={0.1}
          wireframe={false}
        />
      </mesh>

      {/* Grid Crop Row Lines */}
      <gridHelper args={[30, 30, '#4ade80', '#166534']} position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
};

// 2. Floating AI Farming Robot / Drone
const AIFarmingRobot = () => {
  const robotGroupRef = useRef();
  const rotorRef1 = useRef();
  const rotorRef2 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (robotGroupRef.current) {
      robotGroupRef.current.position.y = Math.sin(t * 1.5) * 0.3 + 0.5;
      robotGroupRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
    }
    if (rotorRef1.current) rotorRef1.current.rotation.y += 0.3;
    if (rotorRef2.current) rotorRef2.current.rotation.y -= 0.3;
  });

  return (
    <group ref={robotGroupRef} position={[0, 0.5, 0]}>
      {/* Central Spherical AI Core */}
      <mesh castShadow>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Glowing Glowing Core Ring */}
      <mesh>
        <torusGeometry args={[0.75, 0.06, 16, 100]} />
        <meshStandardMaterial color="#4ade80" emissive="#22c55e" emissiveIntensity={2} />
      </mesh>

      {/* Sensor Eye */}
      <mesh position={[0, 0, 0.65]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={3} />
      </mesh>

      {/* Rotor Arms */}
      <mesh position={[-1.2, 0.3, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 2.4]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Rotor Blades */}
      <group position={[-1.2, 0.4, 0]} ref={rotorRef1}>
        <mesh>
          <boxGeometry args={[1.2, 0.02, 0.1]} />
          <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={1} />
        </mesh>
      </group>

      <group position={[1.2, 0.4, 0]} ref={rotorRef2}>
        <mesh>
          <boxGeometry args={[1.2, 0.02, 0.1]} />
          <meshStandardMaterial color="#22c55e" emissive="#16a34a" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* Downward Soil Scanning Spotlight */}
      <spotLight
        position={[0, -0.2, 0]}
        target-position={[0, -4, 0]}
        color="#4ade80"
        intensity={3}
        angle={0.6}
        penumbra={0.5}
        castShadow
      />
    </group>
  );
};

// 3. Floating 3D Particles & Leaves
const FloatingLeaves = () => {
  const leavesRef = useRef();

  const count = 40;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 15,
        y: Math.random() * 6 - 2,
        z: (Math.random() - 0.5) * 10,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        speed: Math.random() * 0.02 + 0.005,
      });
    }
    return temp;
  }, [count]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    particles.forEach((particle, i) => {
      particle.y -= particle.speed;
      if (particle.y < -3) particle.y = 4;
      particle.rotX += 0.01;
      particle.rotY += 0.01;

      dummy.position.set(particle.x + Math.sin(t + i) * 0.2, particle.y, particle.z);
      dummy.rotation.set(particle.rotX, particle.rotY, 0);
      dummy.scale.set(0.12, 0.12, 0.12);
      dummy.updateMatrix();
      leavesRef.current.setMatrixAt(i, dummy.matrix);
    });
    leavesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={leavesRef} args={[null, null, count]}>
      <tetrahedronGeometry args={[0.8, 0]} />
      <meshStandardMaterial color="#86efac" emissive="#22c55e" emissiveIntensity={0.5} />
    </instancedMesh>
  );
};

// 4. Moving Sky Clouds & Flying Birds
const SkyElements = () => {
  const cloudsRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (cloudsRef.current) {
      cloudsRef.current.position.x = Math.sin(t * 0.05) * 2;
    }
  });

  return (
    <group ref={cloudsRef}>
      {/* Cloud 1 */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} position={[-4, 3, -4]}>
        <mesh>
          <dodecahedronGeometry args={[1.2, 1]} />
          <meshStandardMaterial color="#f8fafc" opacity={0.6} transparent roughness={1} />
        </mesh>
      </Float>

      {/* Cloud 2 */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6} position={[5, 3.5, -5]}>
        <mesh>
          <dodecahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial color="#e2e8f0" opacity={0.7} transparent roughness={1} />
        </mesh>
      </Float>
    </group>
  );
};

export const FarmlandScene = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 1.5, 6.5]} fov={50} />

        {/* Ambient & Directional Sun Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.5}
          color="#fef08a"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 5, 2]} intensity={1} color="#4ade80" />

        {/* 3D Objects */}
        <FarmlandTerrain />
        <AIFarmingRobot />
        <FloatingLeaves />
        <SkyElements />

        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
};
