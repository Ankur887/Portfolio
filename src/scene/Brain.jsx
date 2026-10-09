/**
 * @file scene/Brain.jsx
 * Procedural wireframe brain — two-lobe noise-displaced ellipsoid,
 * instanced nodes along the surface, plus edge LineSegments.
 * Slowly rotates and emits a soft pulse.
 *
 * No external models or textures required.
 *
 * @param {{ tier: 'high' | 'low' | 'static' }} props
 */

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const LOBE_SEGS_HIGH = 32
const LOBE_SEGS_LOW  = 16
const NODE_COUNT     = 60
const PULSE_SPEED    = 0.8

/** Smooth noise approximation (no imports needed) */
function smoothNoise(x, y, z) {
  return (
    Math.sin(x * 2.1 + 0.3) * Math.cos(y * 1.7 - 0.5) * Math.sin(z * 1.9 + 0.9) * 0.5 +
    Math.sin(x * 3.3 - 0.7) * Math.sin(y * 2.8 + 0.2) * 0.3
  )
}

/** Displace a sphere's geometry to form one brain lobe */
function buildLobeGeometry(segments, offset, scale) {
  const geo = new THREE.SphereGeometry(1, segments, segments)
  const pos = geo.attributes.position

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)

    // Pinch the medial (inner) face
    const medial = Math.max(0, 1 - Math.abs(x) * 2.5)
    const noise  = smoothNoise(x * 1.8, y * 2.2, z * 1.6) * 0.28

    const r = 1 + noise - medial * 0.3
    const len = Math.sqrt(x * x + y * y + z * z)
    pos.setXYZ(i, (x / len) * r * scale.x + offset.x,
                   (y / len) * r * scale.y + offset.y,
                   (z / len) * r * scale.z + offset.z)
  }
  geo.computeVertexNormals()
  return geo
}

/** Place nodes randomly on lobe surface and build KNN edges */
function buildNodePositions(geoL, geoR, count) {
  const posL = geoL.attributes.position
  const posR = geoR.attributes.position
  const total = posL.count + posR.count
  const nodes = []

  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * total)
    const isL = idx < posL.count
    const src  = isL ? posL : posR
    const j    = isL ? idx  : idx - posL.count
    nodes.push(new THREE.Vector3(src.getX(j), src.getY(j), src.getZ(j)))
  }
  return nodes
}

function buildEdgeBuffer(nodes, k = 2, maxDist = 0.9) {
  const verts = []
  nodes.forEach((n, i) => {
    const nearest = nodes
      .map((m, j) => ({ j, d: n.distanceTo(m) }))
      .filter(({ j, d }) => j !== i && d < maxDist)
      .sort((a, b) => a.d - b.d)
      .slice(0, k)
    nearest.forEach(({ j }) => {
      if (i < j) {
        verts.push(n.x, n.y, n.z, nodes[j].x, nodes[j].y, nodes[j].z)
      }
    })
  })
  return new Float32Array(verts)
}

export default function Brain({ tier }) {
  const groupRef   = useRef()
  const pulseMatL  = useRef()
  const pulseMatR  = useRef()
  const dummy      = useMemo(() => new THREE.Object3D(), [])
  const nodeRef    = useRef()

  const segs = tier === 'high' ? LOBE_SEGS_HIGH : LOBE_SEGS_LOW

  const geoL = useMemo(() => buildLobeGeometry(segs, { x: -0.7, y: 0, z: 0 }, { x: 0.95, y: 1, z: 0.85 }), [segs])
  const geoR = useMemo(() => buildLobeGeometry(segs, { x:  0.7, y: 0, z: 0 }, { x: 0.95, y: 1, z: 0.85 }), [segs])

  const nodes      = useMemo(() => buildNodePositions(geoL, geoR, NODE_COUNT), [geoL, geoR])
  const edgeBuf    = useMemo(() => buildEdgeBuffer(nodes), [nodes])
  const edgeGeo    = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(edgeBuf, 3))
    return g
  }, [edgeBuf])

  const handleNodeMesh = (mesh) => {
    if (!mesh) return
    nodeRef.current = mesh
    nodes.forEach((pos, i) => {
      dummy.position.copy(pos)
      dummy.scale.setScalar(0.04)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    // Slow rotation
    groupRef.current.rotation.y = t * 0.15
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.05
    // Pulse opacity
    const pulse = 0.25 + Math.sin(t * PULSE_SPEED) * 0.15
    if (pulseMatL.current) pulseMatL.current.opacity = pulse
    if (pulseMatR.current) pulseMatR.current.opacity = pulse
  })

  return (
    <group ref={groupRef} position={[-3.5, 1.5, 3]}>
      {/* Left lobe wireframe */}
      <mesh geometry={geoL}>
        <meshBasicMaterial ref={pulseMatL} color="#22d3ee" wireframe transparent opacity={0.25} />
      </mesh>
      {/* Right lobe wireframe */}
      <mesh geometry={geoR}>
        <meshBasicMaterial ref={pulseMatR} color="#8b5cf6" wireframe transparent opacity={0.25} />
      </mesh>

      {/* Surface nodes */}
      <instancedMesh ref={handleNodeMesh} args={[null, null, NODE_COUNT]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} />
      </instancedMesh>

      {/* Node edges */}
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
      </lineSegments>
    </group>
  )
}
