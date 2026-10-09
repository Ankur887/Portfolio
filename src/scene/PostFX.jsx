/**
 * @file scene/PostFX.jsx
 * Bloom + Vignette only. No blur, CA, noise, or DOF.
 * Omitted entirely when perfTier === 'low' | 'static'.
 */

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

/**
 * @param {{ tier: 'high' | 'low' | 'static' }} props
 */
export default function PostFX({ tier }) {
  if (tier !== 'high') return null

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        luminanceThreshold={0.55}
        luminanceSmoothing={0.3}
        intensity={0.8}
        radius={0.6}
      />
      <Vignette
        offset={0.3}
        darkness={0.6}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  )
}
