/**
 * @file scene/SkillConstellation.jsx
 * Six clusters of glowing skill nodes with intra-cluster edges plus
 * a few cross-cluster edges (React↔REST APIs↔FastAPI↔PostgreSQL).
 *
 * Hover: instanceId raycast → billboard label + brighten node + dim rest.
 * Click/tap: pin the highlight.
 *
 * @param {{ tier: 'high' | 'low' | 'static', skillGroups: import('../data/portfolio').SkillGroup[] }} props
 */

import { useRef, useMemo, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

const CLUSTER_SPREAD = 1.2   // local spread within cluster
const CLUSTER_RADIUS = 4.5   // radius of cluster arrangement
const CROSS_EDGES    = [
  // [groupA, itemA, groupB, itemB] — indices into skillGroups
  [1, 0, 1, 3],  // React ↔ REST APIs
  [1, 3, 0, 4],  // REST APIs ↔ SQL  (via SQL cluster)
  [1, 2, 3, 0],  // FastAPI ↔ PostgreSQL
  [1, 3, 1, 2],  // REST APIs ↔ FastAPI
]

export default function SkillConstellation({ tier, skillGroups }) {
  const { camera, raycaster, gl } = useThree()
  const meshRef   = useRef()
  const [hovered, setHovered] = useState(null)   // instanceId
  const [pinned,  setPinned]  = useState(null)   // instanceId

  // Build flat list of nodes with cluster, position, color
  const nodes = useMemo(() => {
    const list = []
    const total = skillGroups.length
    skillGroups.forEach((group, gi) => {
      // Place each cluster in a ring
      const angle = (gi / total) * Math.PI * 2
      const cx = Math.cos(angle) * CLUSTER_RADIUS + 5.5
      const cy = Math.sin(angle) * CLUSTER_RADIUS * 0.6
      const cz = 2

      group.items.forEach((item, ii) => {
        const jitter = (s) => (Math.random() - 0.5) * s
        list.push({
          id: `${gi}-${ii}`,
          instanceId: list.length,
          name: item.short ?? item.name,
          fullName: item.name,
          color: new THREE.Color(group.color),
          groupIndex: gi,
          itemIndex: ii,
          pos: new THREE.Vector3(
            cx + jitter(CLUSTER_SPREAD),
            cy + jitter(CLUSTER_SPREAD),
            cz + jitter(0.8),
          ),
        })
      })
    })
    return list
  }, [skillGroups])

  const totalNodes = nodes.length

  // Build instance matrices
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const colorArr = useMemo(() => new Float32Array(totalNodes * 3), [totalNodes])

  const handleMesh = useCallback((mesh) => {
    if (!mesh) return
    meshRef.current = mesh
    nodes.forEach((node, i) => {
      dummy.position.copy(node.pos)
      dummy.scale.setScalar(0.1)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      node.color.toArray(colorArr, i * 3)
    })
    mesh.instanceMatrix.needsUpdate = true
    mesh.instanceColor = new THREE.InstancedBufferAttribute(colorArr.slice(), 3)
    mesh.instanceColor.needsUpdate = true
  }, [nodes, dummy, colorArr])

  // Build intra-cluster edges
  const edgeGeo = useMemo(() => {
    const verts = []
    const nodeByGroupItem = {}
    nodes.forEach(n => { nodeByGroupItem[`${n.groupIndex}-${n.itemIndex}`] = n })

    // Intra-cluster: connect each node to cluster centroid neighbour
    skillGroups.forEach((group, gi) => {
      const clusterNodes = nodes.filter(n => n.groupIndex === gi)
      if (clusterNodes.length < 2) return
      // Simple star topology from first node
      const center = clusterNodes[0]
      clusterNodes.slice(1).forEach(n => {
        verts.push(center.pos.x, center.pos.y, center.pos.z)
        verts.push(n.pos.x, n.pos.y, n.pos.z)
      })
    })

    // Cross-cluster
    CROSS_EDGES.forEach(([ga, ia, gb, ib]) => {
      const a = nodeByGroupItem[`${ga}-${ia}`]
      const b = nodeByGroupItem[`${gb}-${ib}`]
      if (a && b) {
        verts.push(a.pos.x, a.pos.y, a.pos.z)
        verts.push(b.pos.x, b.pos.y, b.pos.z)
      }
    })

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3))
    return g
  }, [nodes, skillGroups])

  // Dim/brighten logic on hover
  const activeId = pinned ?? hovered

  useFrame(() => {
    if (!meshRef.current) return
    const mesh = meshRef.current
    nodes.forEach((node, i) => {
      const isActive = activeId === null || i === activeId
      const targetScale = isActive ? 0.13 : 0.08
      dummy.matrix.identity()
      dummy.position.copy(node.pos)
      dummy.scale.setScalar(targetScale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      // Tint color
      const c = isActive ? node.color.clone() : node.color.clone().multiplyScalar(0.3)
      mesh.setColorAt(i, c)
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  const handlePointerOver = useCallback((e) => {
    e.stopPropagation()
    setHovered(e.instanceId ?? null)
    gl.domElement.style.cursor = 'pointer'
  }, [gl])

  const handlePointerOut = useCallback(() => {
    setHovered(null)
    gl.domElement.style.cursor = 'auto'
  }, [gl])

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    const id = e.instanceId ?? null
    setPinned(prev => (prev === id ? null : id))
  }, [])

  const hoveredNode = activeId !== null ? nodes[activeId] : null

  return (
    <group>
      {/* Instanced skill nodes */}
      <instancedMesh
        ref={handleMesh}
        args={[null, null, totalNodes]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[1, tier === 'high' ? 12 : 6, tier === 'high' ? 12 : 6]} />
        <meshStandardMaterial
          emissive="#22d3ee"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.4}
          vertexColors
        />
      </instancedMesh>

      {/* Edges */}
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.2} />
      </lineSegments>

      {/* Billboard label on hover */}
      {hoveredNode && (
        <Html position={hoveredNode.pos.toArray()} center distanceFactor={6}>
          <div style={{
            background: 'rgba(5,6,10,0.85)',
            border: '1px solid rgba(34,211,238,0.4)',
            borderRadius: '6px',
            padding: '4px 10px',
            color: '#e6e8ef',
            fontSize: '12px',
            fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            userSelect: 'none',
          }}>
            {hoveredNode.fullName}
          </div>
        </Html>
      )}
    </group>
  )
}
