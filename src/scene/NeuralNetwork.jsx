/**
 * @file scene/NeuralNetwork.jsx
 * Background neural-net motif: instanced sphere nodes + precomputed
 * k-nearest-neighbour edges in a single LineSegments draw call.
 * A vertex-shader uniform pulses edge opacity over time.
 *
 * @param {{ tier: 'high' | 'low' | 'static' }} props
 */

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const NODE_COUNT_HIGH = 80
const NODE_COUNT_LOW  = 35
const K_NEIGHBOURS    = 3   // edges per node
const MAX_EDGE_DIST   = 6   // world-unit threshold for KNN

/** Randomly place nodes in a volume */
function buildNodes(count) {
  return Array.from({ length: count }, () =>
    new THREE.Vector3(
      (Math.random() - 0.5) * 22,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 10,
    )
  )
}

/** Build LineSegments position buffer via KNN */
function buildEdges(nodes) {
  const positions = []
  nodes.forEach((node, i) => {
    // Find K nearest neighbours
    const sorted = nodes
      .map((n, j) => ({ j, d: node.distanceTo(n) }))
      .filter(({ j, d }) => j !== i && d < MAX_EDGE_DIST)
      .sort((a, b) => a.d - b.d)
      .slice(0, K_NEIGHBOURS)

    sorted.forEach(({ j }) => {
      // Only add the edge once (i < j dedup)
      if (i < j) {
        positions.push(node.x, node.y, node.z)
        positions.push(nodes[j].x, nodes[j].y, nodes[j].z)
      }
    })
  })
  return new Float32Array(positions)
}

/** Pulse shader for edges — modulates opacity with a travelling wave */
const edgeVertexShader = /* glsl */`
  varying float vProgress;
  uniform float uTime;

  void main() {
    // Normalise position along edge (0→1 per segment via vertex index)
    vProgress = mod(float(gl_VertexID) * 0.5 + uTime * 0.3, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const edgeFragShader = /* glsl */`
  varying float vProgress;
  uniform vec3 uColor;

  void main() {
    float alpha = 0.08 + 0.12 * sin(vProgress * 3.14159);
    gl_FragColor = vec4(uColor, alpha);
  }
`

export default function NeuralNetwork({ tier }) {
  const groupRef    = useRef()
  const edgeMatRef  = useRef()

  const nodeCount = tier === 'high' ? NODE_COUNT_HIGH : NODE_COUNT_LOW
  const nodes = useMemo(() => buildNodes(nodeCount), [nodeCount])

  // Instanced mesh for nodes
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const nodeRef = useRef()

  // Pre-build instance matrices once
  useMemo(() => {
    if (!nodeRef.current) return
    nodes.forEach((pos, i) => {
      dummy.position.copy(pos)
      dummy.scale.setScalar(0.06 + Math.random() * 0.06)
      dummy.updateMatrix()
      nodeRef.current.setMatrixAt(i, dummy.matrix)
    })
    nodeRef.current.instanceMatrix.needsUpdate = true
  }, [nodes, dummy])

  const edgePositions = useMemo(() => buildEdges(nodes), [nodes])

  const edgeGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3))
    return g
  }, [edgePositions])

  const edgeMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: edgeVertexShader,
        fragmentShader: edgeFragShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime:  { value: 0 },
          uColor: { value: new THREE.Color('#22d3ee') },
        },
      }),
    []
  )

  useFrame(({ clock }) => {
    if (edgeMatRef.current) {
      edgeMatRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
    // Slow ambient drift
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.018
    }
  })

  // After instanced mesh mounts, set matrices
  const handleNodeRef = (mesh) => {
    if (!mesh) return
    nodeRef.current = mesh
    nodes.forEach((pos, i) => {
      dummy.position.copy(pos)
      dummy.scale.setScalar(0.06 + (i % 3) * 0.03)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      <instancedMesh ref={handleNodeRef} args={[null, null, nodeCount]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.55} />
      </instancedMesh>

      {/* Edges */}
      <lineSegments geometry={edgeGeo}>
        <shaderMaterial ref={edgeMatRef} attach="material" args={[{
          vertexShader: edgeVertexShader,
          fragmentShader: edgeFragShader,
          transparent: true,
          depthWrite: false,
          uniforms: {
            uTime:  { value: 0 },
            uColor: { value: new THREE.Color('#22d3ee') },
          },
        }]} />
      </lineSegments>
    </group>
  )
}
