'use client'

import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, PerspectiveCamera, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { easeOutBack, progress } from '@/lib/motion'

// Mirrors the hero SaturnScene from zo7al.is-a.dev, driven by video time instead of the wall clock.
const RING_RADIUS = 5
const RING_TILT = -Math.PI / 2.5
const CAMERA_FOV = 45
const PLANET_SCALE = 1.15
const ORBIT_AXIS = new THREE.Vector3(0, Math.cos(RING_TILT), Math.sin(RING_TILT))

function Saturn({ timeRef }: { timeRef: React.RefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null)
  const planetRef = useRef<THREE.Group>(null)
  const moonRef = useRef<THREE.Group>(null)
  const size = useThree((state) => state.size)

  const halfVerticalFov = THREE.MathUtils.degToRad(CAMERA_FOV / 2)
  const halfHorizontalFov = Math.atan(
    (Math.tan(halfVerticalFov) * Math.max(size.width, 1)) / Math.max(size.height, 1),
  )
  const cameraDistance = (RING_RADIUS + 1) / Math.sin(Math.min(halfVerticalFov, halfHorizontalFov))

  useFrame(() => {
    const t = timeRef.current ?? 0
    const scale = Math.max(0.0001, easeOutBack(progress(t, 0.1, 1.3)))
    if (planetRef.current) planetRef.current.scale.setScalar(scale * PLANET_SCALE)
    if (groupRef.current) groupRef.current.position.y = Math.sin(t * 0.5) * 0.2

    if (moonRef.current) {
      const angle = 0.6 + t * 0.35
      const orbitRadius = RING_RADIUS * PLANET_SCALE
      const orbitalOffset = Math.sin(angle) * orbitRadius
      moonRef.current.position.set(
        Math.cos(angle) * orbitRadius,
        orbitalOffset * ORBIT_AXIS.y,
        orbitalOffset * ORBIT_AXIS.z,
      )
      moonRef.current.scale.setScalar(Math.max(0.0001, easeOutBack(progress(t, 0.8, 1))) * PLANET_SCALE)
    }
  })

  return (
    <>
      <PerspectiveCamera makeDefault fov={CAMERA_FOV} position={[0, 0, cameraDistance]} />
      <group ref={groupRef}>
        <group ref={planetRef}>
          <mesh>
            <sphereGeometry args={[2, 64, 64]} />
            <meshStandardMaterial color="#ff7a00" roughness={0.7} emissive="#ff7a00" emissiveIntensity={0.2} />
          </mesh>
          <mesh rotation={[RING_TILT, 0, 0]}>
            <ringGeometry args={[2.5, RING_RADIUS, 64]} />
            <meshStandardMaterial color="#FFFFFF" transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>
        </group>
        <group ref={moonRef}>
          <mesh>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="#FFB86C" emissive="#FF8E00" emissiveIntensity={0.5} />
          </mesh>
        </group>
        <pointLight position={[0, 0, 0]} intensity={2} color="#ff7a00" />
      </group>
    </>
  )
}

export default function Saturn3D({ t }: { t: number }) {
  const timeRef = useRef(t)
  timeRef.current = t

  return (
    <Canvas
      gl={{ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true }}
      dpr={2}
      resize={{ offsetSize: true }}
      style={{ background: 'transparent' }}
      aria-hidden="true"
    >
      <Environment resolution={128} frames={1}>
        <Lightformer form="ring" color="#b8d8ff" intensity={3} scale={10} position={[0, 5, -10]} />
        <Lightformer
          color="#ffffff"
          intensity={3}
          scale={[8, 3, 1]}
          position={[5, 4, 5]}
          rotation={[0, -Math.PI / 4, 0]}
        />
        <Lightformer
          color="#ffb86b"
          intensity={1}
          scale={[5, 8, 1]}
          position={[-5, 0, 3]}
          rotation={[0, Math.PI / 4, 0]}
        />
      </Environment>
      <Stars radius={100} depth={50} count={2500} factor={4} saturation={0} fade speed={1} />
      <Saturn timeRef={timeRef} />
    </Canvas>
  )
}
