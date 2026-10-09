/**
 * @file scene/HeroText.jsx
 * Decorative 3D "ANKUR" text via drei <Text3D>.
 * - Gentle float animation via useFrame
 * - Mouse-follow tilt clamped to ±0.15 rad, damped with MathUtils.damp
 * - Disabled when tier === 'static'
 * - The real <h1>ANKUR</h1> is in the DOM (visually hidden), this is aria-hidden
 *
 * To swap the font: replace /fonts/helvetiker_regular.typeface.json
 * with any other typeface.json from three.js examples and update the path below.
 */

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text3D, Center, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

const FONT_URL = '/fonts/helvetiker_regular.typeface.json'
const TILT_CLAMP = 0.15  // radians
const DAMP = 4            // damp factor

/**
 * @param {{
 *   mouse: React.RefObject<{x: number, y: number}>,
 *   tier: 'high' | 'low' | 'static'
 * }} props
 */
export default function HeroText({ mouse, tier }) {
  const groupRef = useRef()
  const floatT   = useRef(0)
  // Separate damped values to avoid allocations inside useFrame
  const dampedX  = useRef(0)
  const dampedY  = useRef(0)

  useFrame(({ clock }, delta) => {
    if (!groupRef.current || tier === 'static') return
    floatT.current += delta

    // Float: gentle sine wave
    groupRef.current.position.y = Math.sin(floatT.current * 0.6) * 0.15

    // Mouse tilt — clamp then damp
    const mx = mouse?.current?.x ?? 0
    const my = mouse?.current?.y ?? 0
    const targetX = THREE.MathUtils.clamp(-my * TILT_CLAMP, -TILT_CLAMP, TILT_CLAMP)
    const targetY = THREE.MathUtils.clamp( mx * TILT_CLAMP, -TILT_CLAMP, TILT_CLAMP)

    dampedX.current = THREE.MathUtils.damp(dampedX.current, targetX, DAMP, delta)
    dampedY.current = THREE.MathUtils.damp(dampedY.current, targetY, DAMP, delta)

    groupRef.current.rotation.x = dampedX.current
    groupRef.current.rotation.y = dampedY.current
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Center>
        <Text3D
          font={FONT_URL}
          size={1.1}
          height={0.22}
          curveSegments={10}
          bevelEnabled
          bevelThickness={0.04}
          bevelSize={0.02}
          bevelSegments={4}
        >
          ANKUR
          {tier === 'high' ? (
            <MeshTransmissionMaterial
              backside
              samples={4}
              thickness={0.3}
              roughness={0.1}
              chromaticAberration={0}
              color="#22d3ee"
              distortionScale={0}
              temporalDistortion={0}
              transmission={0.6}
              ior={1.5}
            />
          ) : (
            <meshStandardMaterial
              color="#22d3ee"
              emissive="#22d3ee"
              emissiveIntensity={0.4}
              roughness={0.3}
              metalness={0.6}
            />
          )}
        </Text3D>
      </Center>
    </group>
  )
}
