/**
 * @file scene/SceneRoot.jsx
 * The full 3D scene — loaded lazily behind a <Suspense>.
 * Dispatches sub-components based on perfTier.
 *
 * Canvas config:
 *   - eventSource + eventPrefix to route pointer events through the DOM
 *   - flat=true to skip tone-mapping (we control colors ourselves)
 *   - frameloop='demand' when tier==='static'
 *
 * @param {{
 *   tier: 'high' | 'low' | 'static',
 *   mouse: React.RefObject<{x:number,y:number}>,
 *   skillGroups: import('../data/portfolio').SkillGroup[],
 *   experience: import('../data/portfolio').ExperienceItem[]
 * }} props
 */

import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'

import CameraRig         from './CameraRig'
import ParticleField     from './ParticleField'
import NeuralNetwork     from './NeuralNetwork'
import HeroText          from './HeroText'
import Brain             from './Brain'
import SkillConstellation from './SkillConstellation'
import ExperiencePath    from './ExperiencePath'
import PostFX            from './PostFX'
import { useScrollStore } from '../store/scroll'

export default function SceneRoot({ tier, mouse, skillGroups, experience }) {
  const dpr      = tier === 'low' ? [1, 1.5] : [1, 2]
  const antialias = tier !== 'low'
  const frameloop = tier === 'static' ? 'demand' : 'always'

  // sectionProgress for ExperiencePath (section 3)
  const expProgress = useScrollStore(s => s.sectionProgress[3] ?? 0)

  // Pause rendering when tab is hidden
  useEffect(() => {
    const el = document.querySelector('canvas')
    if (!el) return
    const onVis = () => {
      if (document.hidden && el.__r3f?.fiber) {
        el.__r3f.fiber.setFrameloop('demand')
      } else if (el.__r3f?.fiber) {
        el.__r3f.fiber.setFrameloop(frameloop)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [frameloop])

  return (
    <Canvas
      aria-hidden="true"
      tabIndex={-1}
      dpr={dpr}
      frameloop={frameloop}
      flat
      gl={{
        antialias,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.NoToneMapping,
      }}
      camera={{ fov: 60, near: 0.1, far: 100, position: [0, 0, 10] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      eventSource={document.getElementById('root')}
      eventPrefix="client"
      onCreated={({ gl }) => {
        // WebGL context loss recovery
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          console.warn('[R3F] WebGL context lost — will attempt restore')
        })
        gl.domElement.addEventListener('webglcontextrestored', () => {
          console.info('[R3F] WebGL context restored')
        })
      }}
    >
      {/* Performance monitor steps down DPR if FPS drops below 45 */}
      {tier === 'high' && (
        <PerformanceMonitor
          factor={1}
          threshold={0.9}
          onDecline={() => console.info('[Perf] Stepping down DPR')}
        />
      )}
      {tier === 'high' && <AdaptiveDpr pixelated />}

      {/* Ambient and directional light */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} color="#c7d2fe" />
      <pointLight position={[-4, 4, 2]} intensity={0.4} color="#22d3ee" />

      {/* Camera spline rig */}
      <CameraRig tier={tier} />

      {/* Background layers — always rendered */}
      <ParticleField tier={tier} mouse={mouse} />
      {tier !== 'static' && <NeuralNetwork tier={tier} />}

      {/* Section 3D elements */}
      <HeroText mouse={mouse} tier={tier} />
      {tier !== 'static' && <Brain tier={tier} />}
      {tier !== 'static' && (
        <SkillConstellation tier={tier} skillGroups={skillGroups} />
      )}
      {tier !== 'static' && (
        <ExperiencePath experience={experience} sectionProgress={expProgress} />
      )}

      {/* Post-processing (high tier only) */}
      <PostFX tier={tier} />
    </Canvas>
  )
}
