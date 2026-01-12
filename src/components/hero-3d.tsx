"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Environment, MeshTransmissionMaterial, Trail } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

// Orbiting crystal that leaves a glowing trail
function OrbitingCrystal({ 
  radius, 
  speed, 
  offset, 
  color 
}: { 
  radius: number; 
  speed: number; 
  offset: number; 
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    meshRef.current.position.x = Math.cos(t) * radius;
    meshRef.current.position.z = Math.sin(t) * radius;
    meshRef.current.position.y = Math.sin(t * 2) * 0.5;
    meshRef.current.rotation.x = t;
    meshRef.current.rotation.y = t * 0.5;
  });

  return (
    <Trail
      width={1.5}
      length={8}
      color={color}
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef} scale={0.12}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Trail>
  );
}

// Main floating icosahedron with glass effect
function MainCrystal({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!meshRef.current || !mouse.current) return;

    // Smooth follow mouse with gentle movement
    const targetX = (mouse.current.x * viewport.width) / 6;
    const targetY = (mouse.current.y * viewport.height) / 6;

    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      targetX,
      0.03
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      0.03
    );

    // Continuous rotation
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;

    // Inner mesh counter-rotation for cool effect
    if (innerRef.current) {
      innerRef.current.rotation.x = -state.clock.elapsedTime * 0.3;
      innerRef.current.rotation.y = -state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={meshRef}>
        {/* Outer glass shell - simplified for performance */}
        <mesh scale={2}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshTransmissionMaterial
            backside
            samples={4}
            resolution={256}
            transmission={0.9}
            roughness={0.15}
            clearcoat={0.8}
            clearcoatRoughness={0.15}
            thickness={0.5}
            chromaticAberration={0.3}
            distortion={0.15}
            distortionScale={0.3}
            temporalDistortion={0.05}
            color="#a855f7"
            attenuationDistance={0.5}
            attenuationColor="#7c3aed"
          />
        </mesh>
        
        {/* Inner glowing core */}
        <mesh ref={innerRef} scale={0.8}>
          <icosahedronGeometry args={[1, 2]} />
          <meshStandardMaterial
            color="#c084fc"
            emissive="#a855f7"
            emissiveIntensity={3}
            roughness={0.2}
            metalness={0.9}
            wireframe
          />
        </mesh>

        {/* Center point light for glow effect */}
        <pointLight color="#a855f7" intensity={5} distance={5} />
      </group>
    </Float>
  );
}

// Secondary floating element
function SecondaryShape({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (!meshRef.current || !mouse.current) return;

    // React to mouse with inverse movement
    const targetX = -(mouse.current.x * viewport.width) / 10;
    const targetY = -(mouse.current.y * viewport.height) / 10;

    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      targetX + 3.5,
      0.02
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY - 1.5,
      0.02
    );

    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} position={[3.5, -1.5, -3]} scale={1}>
        <torusGeometry args={[0.8, 0.3, 16, 32]} />
        <MeshDistortMaterial
          color="#06b6d4"
          attach="material"
          distort={0.2}
          speed={2}
          roughness={0.1}
          metalness={0.9}
          emissive="#0891b2"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
}

// Generate positions outside of component to avoid React compiler issues
function generateParticlePositions(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  
  const colorA = new THREE.Color("#a855f7");
  const colorB = new THREE.Color("#06b6d4");
  
  for (let i = 0; i < count; i++) {
    // Distribute in a sphere pattern
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 8 + Math.random() * 12;
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    
    // Mix colors
    const mixAmount = Math.random();
    const color = colorA.clone().lerp(colorB, mixAmount);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    
    // Random sizes
    sizes[i] = Math.random() * 0.5 + 0.1;
  }
  
  return { positions, colors, sizes };
}

const PARTICLE_DATA = generateParticlePositions(200);

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[PARTICLE_DATA.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[PARTICLE_DATA.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Glowing rings around main crystal
function GlowRing({ 
  radius, 
  color, 
  rotationSpeed,
  tilt 
}: { 
  radius: number; 
  color: string;
  rotationSpeed: number;
  tilt: [number, number, number];
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = state.clock.elapsedTime * rotationSpeed;
  });

  return (
    <mesh ref={ringRef} rotation={tilt}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function Scene({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  return (
    <>
      {/* Ambient and directional lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      
      {/* Colored point lights for atmosphere */}
      <pointLight position={[-5, 5, 5]} intensity={2} color="#a855f7" distance={15} />
      <pointLight position={[5, -5, -5]} intensity={2} color="#06b6d4" distance={15} />
      <pointLight position={[0, 0, 8]} intensity={1} color="#ec4899" distance={10} />
      
      {/* Main elements */}
      <MainCrystal mouse={mouse} />
      <SecondaryShape mouse={mouse} />
      
      {/* Orbiting crystals */}
      <OrbitingCrystal radius={3.5} speed={0.4} offset={0} color="#a855f7" />
      <OrbitingCrystal radius={3.5} speed={0.4} offset={Math.PI} color="#06b6d4" />
      <OrbitingCrystal radius={4.5} speed={-0.25} offset={Math.PI / 2} color="#ec4899" />
      
      {/* Glowing rings */}
      <GlowRing radius={2.8} color="#a855f7" rotationSpeed={0.3} tilt={[Math.PI / 2, 0, 0]} />
      <GlowRing radius={3.2} color="#06b6d4" rotationSpeed={-0.2} tilt={[Math.PI / 3, Math.PI / 4, 0]} />
      
      {/* Particle field */}
      <ParticleField />
      
      {/* Environment for reflections */}
      <Environment preset="night" />
    </>
  );
}

export function Hero3D() {
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent) => {
    mouse.current = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    };
  };

  return (
    <div
      className="absolute inset-0 z-0"
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: false, 
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <Scene mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  );
}
