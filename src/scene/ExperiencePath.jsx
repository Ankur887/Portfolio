/**
 * @file scene/ExperiencePath.jsx
 * Glowing TubeGeometry path along a curve with one node per experience entry.
 * A shader uniform drives the "progress" fill (lit segment) tied to scroll.
 *
 * @param {{ experience: import('../data/portfolio').ExperienceItem[], sectionProgress: number }} props
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const TUBE_VERTEX = /* glsl */`
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const TUBE_FRAG = /* glsl */`
  varying vec3 vPos;
  uniform float uProgress;
  uniform float uLength;

  void main() {
    // Map position along tube Y axis (0 = start, 1 = end)
    float t = (vPos.y + uLength * 0.5) / uLength;
    float lit = step(t, uProgress);
    vec3 color = mix(vec3(0.054, 0.078, 0.16), vec3(0.133, 0.827, 0.933), lit);
    float glow = lit * 0.5;
    gl_FragColor = vec4(color + glow, 0.9);
  }
`

export default function ExperiencePath({ experience, sectionProgress }) {
  const tubeMatRef = useRef()
  const dummy      = useMemo(() => new THREE.Object3D(), [])
  const nodeRef    = useRef()

  // Build a vertical curve with one waypoint per role
  const curve = useMemo(() => {
    const count  = experience.length
    const points = experience.map((_, i) => {
      const t = i / (count - 1)
      return new THREE.Vector3(
        Math.sin(t * Math.PI) * 1.2 + 2.5,
        3 - t * 6,
        4 + Math.cos(t * Math.PI) * 0.5,
      )
    })
    return new THREE.CatmullRomCurve3(points)
  }, [experience])

  const tubeGeo = useMemo(
    () => new THREE.TubeGeometry(curve, 60, 0.04, 6, false),
    [curve]
  )

  const nodePositions = useMemo(
    () => experience.map((_, i) => curve.getPoint(i / (experience.length - 1))),
    [curve, experience]
  )

  const handleNodeMesh = (mesh) => {
    if (!mesh) return
    nodeRef.current = mesh
    nodePositions.forEach((pos, i) => {
      dummy.position.copy(pos)
      dummy.scale.setScalar(0.12)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }

  useFrame(() => {
    if (tubeMatRef.current) {
      // sectionProgress drives the lit fill
      tubeMatRef.current.uniforms.uProgress.value = sectionProgress
    }
  })

  return (
    <group>
      {/* Glowing tube */}
      <mesh geometry={tubeGeo}>
        <shaderMaterial
          ref={tubeMatRef}
          vertexShader={TUBE_VERTEX}
          fragmentShader={TUBE_FRAG}
          transparent
          uniforms={{
            uProgress: { value: 0 },
            uLength:   { value: 6 },
          }}
        />
      </mesh>

      {/* Node spheres at each role */}
      <instancedMesh ref={handleNodeMesh} args={[null, null, experience.length]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={0.7}
          roughness={0.1}
          metalness={0.5}
        />
      </instancedMesh>
    </group>
  )
}
