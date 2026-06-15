'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

function HeroModel({ isMobile }: { isMobile: boolean }) {
    const { scene, animations } = useGLTF('/models/hero.glb');
    const mixer = useRef<THREE.AnimationMixer | null>(null);

    useEffect(() => {
        // Animation intégrée du modèle
        if (animations.length > 0) {
            mixer.current = new THREE.AnimationMixer(scene);
            const action = mixer.current.clipAction(animations[0]);
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.play();
        }

        // Material sombre métallique avec lueur violette
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color('#08051a'),
                    metalness: 1,
                    roughness: 0.04,
                    emissive: new THREE.Color('#5030d0'),
                    emissiveIntensity: 0.5,
                });
                mesh.castShadow    = false;
                mesh.receiveShadow = false;
            }
        });

        return () => { mixer.current?.stopAllAction(); };
    }, [scene, animations]);

    useFrame((_, delta) => {
        mixer.current?.update(delta);
        scene.rotation.y += delta * 0.18;
    });

    return (
        <primitive
            object={scene}
            position={[1.4, 0, 0]}
            scale={isMobile ? 1.6 : 2.4}
        />
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
            }}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
            <Environment preset="night" />
            <ambientLight intensity={0.04} />
            <pointLight position={[2, 2, 4]}  color="#8060ff" intensity={12} distance={12} />
            <pointLight position={[-4, -2, 2]} color="#200840" intensity={5}  distance={14} />
            <pointLight position={[3, 4, -2]}  color="#1020a0" intensity={4}  distance={10} />
            <HeroModel isMobile={isMobile} />
        </Canvas>
    );
}

useGLTF.preload('/models/hero.glb');
