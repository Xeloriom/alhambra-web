'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Particles({ count }: { count: number }) {
    const ref = useRef<THREE.Points>(null);
    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            arr[i * 3]     = (Math.random() - 0.5) * 12;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
        }
        return arr;
    }, [count]);

    useFrame((state) => {
        if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.04;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.04} color="#6040c0" transparent opacity={0.35} sizeAttenuation />
        </points>
    );
}

function KnotMesh({ isMobile }: { isMobile: boolean }) {
    const ref   = useRef<THREE.Mesh>(null);
    const { pointer } = useThree();

    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.elapsedTime;
        ref.current.rotation.x = t * 0.07 + pointer.y * 0.08;
        ref.current.rotation.y = t * 0.11 + pointer.x * 0.08;
        ref.current.position.y = Math.sin(t * 0.55) * 0.18;
    });

    const [tubeSeg, radSeg] = isMobile ? [64, 12] : [200, 20];

    return (
        <mesh ref={ref} position={[1.4, 0, 0]} scale={isMobile ? 0.9 : 1}>
            <torusKnotGeometry args={[1.15, 0.32, tubeSeg, radSeg]} />
            <MeshDistortMaterial
                color="#0d0820"
                roughness={0.04}
                metalness={0.96}
                distort={isMobile ? 0.12 : 0.18}
                speed={isMobile ? 0.8 : 1.4}
                envMapIntensity={3}
            />
        </mesh>
    );
}

export function ContactThreeScene({ isMobile = false }: { isMobile?: boolean }) {
    return (
        <Canvas
            camera={{ position: [0, 0, 6], fov: 44 }}
            dpr={isMobile ? 1 : [1, 1.5]}
            gl={{
                antialias: !isMobile,
                alpha: true,
                powerPreference: 'high-performance',
                stencil: false,
                depth: false,
            }}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
            <Environment preset="city" />
            <ambientLight intensity={0.15} />
            <pointLight position={[-4, 2, 3]} color="#8060ff" intensity={7} distance={14} />
            <pointLight position={[4, -2, -2]} color="#3020a0" intensity={5} distance={12} />
            <pointLight position={[0, 4, 2]} color="#c0a0ff" intensity={3} distance={10} />
            <KnotMesh isMobile={isMobile} />
            {!isMobile && <Particles count={60} />}
        </Canvas>
    );
}
