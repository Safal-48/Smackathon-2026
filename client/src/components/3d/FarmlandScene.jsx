import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// 1. High-Tech Holographic Farming Terrain
const FarmlandTerrain = () => {
  const terrainRef = useRef();

  useFrame(({ clock, pointer }) => {
    if (terrainRef.current) {
      const position = terrainRef.current.geometry.attributes.position;
      const t = clock.getElapsedTime();
      const mouseFactorX = pointer.x * 0.8;
      const mouseFactorY = pointer.y * 0.8;

      for (let i = 0; i < position.count; i++) {
        const x = position.getX(i);
        const y = position.getY(i);
        const z =
          Math.sin(x * 0.4 + t * 1.2 + mouseFactorX) * 0.35 +
          Math.cos(y * 0.4 + t * 0.9 + mouseFactorY) * 0.35;
        position.setZ(i, z);
      }
      terrainRef.current.geometry.computeVertexNormals();
      position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -2.2, 0]} rotation={[-Math.PI / 2.3, 0, 0]}>
      {/* Dynamic Soil Surface */}
      <mesh ref={terrainRef} receiveShadow>
        <planeGeometry args={[36, 36, 44, 44]} />
        <meshStandardMaterial
          color="#0a1a12"
          roughness={0.4}
          metalness={0.6}
          wireframe={false}
        />
      </mesh>

      {/* Cybernetic Neon Green Crop Grid Lines */}
      <gridHelper args={[36, 36, '#10b981', '#064e3b']} position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
};

// 2. Ambient Bio-Luminescent Atmospheric Glow
const AmbientBioGlow = () => {
  const glowRef = useRef();

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    if (glowRef.current) {
      glowRef.current.position.x = pointer.x * 1.5;
      glowRef.current.position.y = pointer.y * 1.0 + Math.sin(t * 0.8) * 0.2;
    }
  });

  return (
    <group ref={glowRef} position={[0, 1.5, -5]}>
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#065f46"
          emissive="#10b981"
          emissiveIntensity={0.6}
          transparent
          opacity={0.25}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
};

// 3. Swirling 3D Bio-Pollen & Glowing Crystals
const FloatingLeaves = () => {
  const leavesRef = useRef();
  const count = 90;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 22,
        y: Math.random() * 8 - 3,
        z: (Math.random() - 0.5) * 12 - 2,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        speed: Math.random() * 0.015 + 0.005,
      });
    }
    return temp;
  }, [count]);

  useFrame(({ clock, pointer }) => {
    const t = clock.getElapsedTime();
    particles.forEach((particle, i) => {
      particle.y -= particle.speed;
      if (particle.y < -3.5) particle.y = 5;
      particle.rotX += 0.015;
      particle.rotY += 0.015;

      const mouseOffX = pointer.x * (i % 2 === 0 ? 0.4 : -0.4);
      const mouseOffY = pointer.y * 0.2;

      dummy.position.set(particle.x + Math.sin(t + i) * 0.3 + mouseOffX, particle.y + mouseOffY, particle.z);
      dummy.rotation.set(particle.rotX, particle.rotY, 0);
      const scale = 0.08 + (i % 3) * 0.04;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      leavesRef.current.setMatrixAt(i, dummy.matrix);
    });
    leavesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={leavesRef} args={[null, null, count]}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#6ee7b7" emissive="#10b981" emissiveIntensity={1.4} roughness={0.2} />
    </instancedMesh>
  );
};

// 4. Moving Floating Polyhedrons
const SkyElements = () => {
  const cloudsRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = t * 0.04;
    }
  });

  return (
    <group ref={cloudsRef}>
      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.6} position={[-6, 2.8, -4]}>
        <mesh>
          <icosahedronGeometry args={[1.0, 0]} />
          <meshStandardMaterial color="#059669" emissive="#10b981" emissiveIntensity={0.6} wireframe />
        </mesh>
      </Float>

      <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.7} position={[7, 3.2, -5]}>
        <mesh>
          <dodecahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial color="#34d399" emissive="#059669" emissiveIntensity={0.7} wireframe />
        </mesh>
      </Float>
    </group>
  );
};

export const FarmlandScene = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-80">
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 1.2, 5.8]} fov={50} />

        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 15, 10]} intensity={1.8} color="#fef08a" castShadow />
        <pointLight position={[-6, 6, 2]} intensity={2} color="#10b981" />
        <pointLight position={[6, -2, 3]} intensity={1.5} color="#34d399" />

        <Stars radius={100} depth={50} count={1200} factor={4} saturation={1} fade speed={1.5} />

        <FarmlandTerrain />
        <AmbientBioGlow />
        <FloatingLeaves />
        <SkyElements />

        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
};

