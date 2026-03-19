import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';

export interface NetworkBlobProps {
  phase: 'early' | 'middle' | 'final' | 'synthesis';
}

const SPECIAL_NODE_COUNT = 12;
const HIGHLIGHT_INTERVAL_MS = 1800;

// ─── AnimatedLine ────────────────────────────────────────────────────────────

const AnimatedLine: React.FC<{
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
}> = ({ start, end, color }) => {
  const [progress, setProgress] = useState(0);

  useFrame((_state, delta) => {
    if (progress < 1) {
      setProgress(prev => Math.min(prev + delta * 2.5, 1));
    }
  });

  const currentEnd = useMemo(
    () => new THREE.Vector3().copy(start).lerp(end, progress),
    [start, end, progress],
  );

  return (
    <Line
      points={[start, currentEnd]}
      color={color}
      lineWidth={1.5}
      transparent
      opacity={0.6}
    />
  );
};

// ─── Node ────────────────────────────────────────────────────────────────────

const Node: React.FC<{
  position: THREE.Vector3;
  isSpecial: boolean;
  isHighlighted: boolean;
  isSynthesizing: boolean;
  highlightedNodes: number[];
  points: THREE.Vector3[];
  index: number;
}> = ({ position, isSpecial, isHighlighted, isSynthesizing, highlightedNodes, points, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(state => {
    if (!meshRef.current || !materialRef.current) return;
    const t = state.clock.getElapsedTime();

    if (isSynthesizing && isHighlighted) {
      meshRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.05);
      materialRef.current.emissiveIntensity = 1.5 + Math.sin(t * 8) * 0.5;
      materialRef.current.color.set('#26D07C');
      materialRef.current.emissive.set('#26D07C');
    } else if (isHighlighted) {
      meshRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.1);
      materialRef.current.emissiveIntensity = 0.95 + Math.sin(t * 10) * 0.15;
    } else {
      meshRef.current.scale.setScalar(1);
      materialRef.current.emissiveIntensity = 0;
    }
  });

  const nodeColor = isHighlighted ? '#26D07C' : isSpecial ? '#60a5fa' : '#bfdbfe';

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[isSpecial ? 0.14 : 0.04, 32, 32]} />
        <meshStandardMaterial
          ref={materialRef}
          color={nodeColor}
          emissive={isHighlighted ? '#26D07C' : '#000000'}
          emissiveIntensity={isHighlighted ? 1 : 0}
          transparent
          opacity={isHighlighted ? 1 : isSpecial ? 1.0 : 0.7}
          roughness={isHighlighted ? 0.1 : 0.2}
          metalness={isHighlighted ? 0.4 : 0.1}
        />
      </mesh>

      {/* Animated connection lines from primary highlighted node to others */}
      {highlightedNodes[0] === index && highlightedNodes.length > 1 && !isSynthesizing &&
        highlightedNodes.slice(1).map(neighborIndex => (
          <AnimatedLine
            key={`line-${index}-${neighborIndex}`}
            start={new THREE.Vector3(0, 0, 0)}
            end={points[neighborIndex].clone().sub(position)}
            color="#26D07C"
          />
        ))}
    </group>
  );
};

// ─── Blob (Three.js scene content) ───────────────────────────────────────────

const Blob: React.FC<NetworkBlobProps> = ({ phase }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([]);
  const isSynthesizing = phase === 'synthesis';

  const points = useMemo(() => {
    const temp: THREE.Vector3[] = [];
    const count = 150;
    for (let i = 0; i < count; i++) {
      const isInner = i < count * 0.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = isInner
        ? 1.8 + Math.random() * (4.5 - 1.8)
        : 4.8 + Math.random() * (6 - 4.8);
      temp.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ),
      );
    }
    return temp;
  }, []);

  const linesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (points[i].distanceTo(points[j]) < 2.5) {
          positions.push(points[i].x, points[i].y, points[i].z);
          positions.push(points[j].x, points[j].y, points[j].z);
        }
      }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [points]);

  // Stable set of visually distinct "special" nodes — selected by spread across the blob
  const specialNodeIndices = useMemo(() => {
    const sorted = Array.from({ length: points.length }, (_, i) => i).sort(
      (a, b) => points[a].length() - points[b].length(),
    );
    const step = Math.floor(sorted.length / SPECIAL_NODE_COUNT);
    return Array.from({ length: SPECIAL_NODE_COUNT }, (_, i) => sorted[i * step]);
  }, [points]);

  // Periodically activate a random cluster of nodes; during synthesis light them all up
  useEffect(() => {
    if (isSynthesizing) {
      setHighlightedNodes(specialNodeIndices);
      return;
    }

    const pickRandom = () => {
      const shuffled = [...specialNodeIndices].sort(() => Math.random() - 0.5);
      setHighlightedNodes(shuffled.slice(0, 3));
    };

    pickRandom();
    const interval = setInterval(pickRandom, HIGHLIGHT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isSynthesizing, specialNodeIndices]);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * (isSynthesizing ? 0.005 : 0.012);
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial color="#93c5fd" transparent opacity={0.25} />
      </lineSegments>

      {points.map((point, i) => (
        <Node
          key={i}
          index={i}
          position={point}
          isSpecial={specialNodeIndices.includes(i)}
          isHighlighted={highlightedNodes.includes(i)}
          isSynthesizing={isSynthesizing}
          highlightedNodes={highlightedNodes}
          points={points}
        />
      ))}
    </group>
  );
};

// ─── NetworkBlob (exported) ───────────────────────────────────────────────────

export const NetworkBlob: React.FC<NetworkBlobProps> = ({ phase }) => {
  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 22], fov: 45 }}>
        <fog attach="fog" args={['#ffffff', 18, 28]} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Blob phase={phase} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-white/5" />
    </div>
  );
};
