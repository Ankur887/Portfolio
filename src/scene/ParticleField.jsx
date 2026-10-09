/**
 * @file scene/ParticleField.jsx
 * GPU-friendly two-layer star/particle field using <points>.
 * Mouse parallax via damped group rotation — no per-particle CPU updates.
 *
 * @param {{ tier: 'high' | 'low' | 'static', mouse: React.RefObject<{x:number,y:number}> }} props
 */

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT_HIGH = 2200
const COUNT_LOW  = 800

/** Build Float32Array positions in a sphere */
function buildPositions(count, spread) {
  const arr = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)
    const r     = (0.4 + Math.random() * 0.6) * spread
    arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    arr[i * 3 + 2] = r * Math.cos(phi)
  }
  return arr
}

export default function ParticleField({ tier, mouse }) {
  const groupRef   = useRef()
  const targetRot  = useRef({ x: 0, y: 0 })

  const count = tier === 'high' ? COUNT_HIGH : COUNT_LOW
  // Two depth layers: near and far
  const nearPositions = useMemo(() => buildPositions(Math.floor(count * 0.4), 14), [count])
  const farPositions  = useMemo(() => buildPositions(Math.floor(count * 0.6), 28), [count])

  const nearGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(nearPositions, 3))
    return g
  }, [nearPositions])

  const farGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(farPositions, 3))
    return g
  }, [farPositions])

  const nearMat = useMemo(
    () => new THREE.PointsMaterial({ color: '#22d3ee', size: 0.045, sizeAttenuation: true, transparent: true, opacity: 0.7 }),
    []
  )
  const farMat = useMemo(
    () => new THREE.PointsMaterial({ color: '#8b5cf6', size: 0.025, sizeAttenuation: true, transparent: true, opacity: 0.4 }),
    []
  )

  useFrame((_, delta) => {
    if (!groupRef.current) return
    // Damp target rotation toward mouse position (parallax)
    const mx = mouse?.current?.x ?? 0
    const my = mouse?.current?.y ?? 0
    targetRot.current.y += (mx * 0.12 - targetRot.current.y) * 0.04
    targetRot.current.x += (-my * 0.08 - targetRot.current.x) * 0.04

    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y, targetRot.current.y, 3, delta
    )
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x, targetRot.current.x, 3, delta
    )

    // Slow ambient spin
    groupRef.current.rotation.y += delta * 0.012
  })

  return (
    <group ref={groupRef}>
      <points geometry={nearGeo} material={nearMat} />
      <points geometry={farGeo}  material={farMat}  />
    </group>
  )
}
