'use client';

/**
 * StadiumScene — Cena WebGL 3D do estádio
 *
 * Layers:
 * - 800 partículas gold/cyan em espiral flutuante
 * - 200 micro-partículas brancas (névoa)
 * - 3 fontes de luz pulsante (estádio)
 * - Stars no fundo distante
 * - Post-processing: Bloom volumétrico
 *
 * Renderizado como <Canvas> overlay sobre o hero HTML.
 * SSR desabilitado via dynamic() no wrapper.
 */

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// ── Partículas gold flutuando em espiral ──────────────────────────────────────
function GoldParticles({ count = 600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    const gold = new THREE.Color('#F5C400');
    const cyan = new THREE.Color('#00F3FF');

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r     = 2 + Math.random() * 12;
      const h     = (Math.random() - 0.5) * 8;
      positions[i * 3]     = Math.cos(theta) * r;
      positions[i * 3 + 1] = h;
      positions[i * 3 + 2] = Math.sin(theta) * r * 0.5;

      const c = i % 3 === 0 ? cyan : gold;
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.04;
    ref.current.rotation.z = Math.sin(t * 0.07) * 0.06;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

// ── Anel de energia orbitando ─────────────────────────────────────────────────
function EnergyRing() {
  const ref = useRef<THREE.Mesh>(null!);
  const matRef = useRef<THREE.MeshBasicMaterial>(null!);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.5) * 0.3;
    ref.current.rotation.z = t * 0.2;
    if (matRef.current) {
      matRef.current.opacity = 0.12 + Math.sin(t * 1.5) * 0.06;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -2]}>
      <torusGeometry args={[5, 0.04, 8, 120]} />
      <meshBasicMaterial ref={matRef} color="#F5C400" transparent opacity={0.15} />
    </mesh>
  );
}

// ── Luzes de estádio pulsantes ────────────────────────────────────────────────
function StadiumLight({ position, color, phase = 0 }: {
  position: [number, number, number];
  color: string;
  phase?: number;
}) {
  const ref = useRef<THREE.PointLight>(null!);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.intensity = 2 + Math.sin(clock.getElapsedTime() * 1.8 + phase) * 0.8;
  });
  return <pointLight ref={ref} position={position} color={color} intensity={2.5} distance={18} decay={2} />;
}

// ── Cena completa ─────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} color="#1a1000" />
      <StadiumLight position={[-6, 4, 2]}  color="#F5C400" phase={0} />
      <StadiumLight position={[6, 4, 2]}   color="#00F3FF" phase={Math.PI} />
      <StadiumLight position={[0, -2, 6]}  color="#F5C400" phase={Math.PI / 2} />

      <GoldParticles count={700} />
      <EnergyRing />
      <Sparkles count={60} scale={14} size={1.8} speed={0.3} color="#F5C400" opacity={0.5} />
      <Stars radius={40} depth={12} count={800} factor={2} saturation={0} fade speed={1.2} />

      <EffectComposer>
        <Bloom
          intensity={1.4}
          luminanceThreshold={0.05}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export default function StadiumScene({ className }: { className?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 70 }}
      className={className}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.5]}
    >
      <Scene />
    </Canvas>
  );
}
