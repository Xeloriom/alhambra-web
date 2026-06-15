'use client';

import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

function MorphingSphere({ isMobile }: { isMobile: boolean }) {
    const mesh  = useRef<THREE.Mesh>(null);
    const light = useRef<THREE.PointLight>(null);
    const { pointer } = useThree();

    useFrame((state) => {
        if (!mesh.current) return;
        const t = state.clock.elapsedTime;
        mesh.current.rotation.y  = t * 0.12;
        mesh.current.rotation.x += (pointer.y * 0.25 - mesh.current.rotation.x) * 0.04;
        mesh.current.rotation.z += (-pointer.x * 0.15 - mesh.current.rotation.z) * 0.04;
        if (light.current) {
            light.current.position.x = Math.sin(t * 0.4) * 4;
            light.current.position.z = Math.cos(t * 0.4) * 4;
            light.current.position.y = Math.cos(t * 0.25) * 2;
        }
    });

    const segs = isMobile ? 48 : 128;

    return (
        <>
            <pointLight ref={light} color="#7060ff" intensity={8} distance={10} />
            <pointLight position={[-4, -2, 2]} color="#200840" intensity={4} distance={12} />
            <pointLight position={[3, 4, -2]} color="#102060" intensity={3} distance={10} />
            <mesh ref={mesh} scale={2.2} position={[1.2, 0, 0]}>
                <sphereGeometry args={[1, segs, segs]} />
                <MeshDistortMaterial
                    color="#0d0824"
                    roughness={0.08}
                    metalness={1}
                    distort={0.38}
                    speed={isMobile ? 1.0 : 1.6}
                    envMapIntensity={3}
                />
            </mesh>
        </>
    );
}

export function HeroThreeScene({ isMobile = false }: { isMobile?: boolean }) {
    return (
        <Canvas
            camera={{ position: [0, 0, 5.5], fov: 42 }}
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
            <Environment preset="night" />
            <ambientLight intensity={0.05} />
            <MorphingSphere isMobile={isMobile} />
        </Canvas>
    );
}
