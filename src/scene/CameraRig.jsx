/**
 * @file scene/CameraRig.jsx
 * Moves the camera along a CatmullRomCurve3 spline based on scroll progress.
 *
 * Key design decisions:
 * 1. Read scroll from zustand store with .getState() inside useFrame
 *    to avoid React re-renders on every scroll tick.
 * 2. dwellEase() creates "gravity wells" that slow the camera near each node.
 * 3. THREE.MathUtils.damp() (framerate-independent) smooths position + lookAt.
 * 4. lookAt targets a point LOOK_AHEAD_T further along the curve so the
 *    camera always faces slightly forward.
 * 5. In 'static' tier, camera is fixed at anchor[0] and never moves.
 */

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { cameraAnchors, dwellEase, LOOK_AHEAD_T } from '../data/cameraPath'
import { useScrollStore } from '../store/scroll'

const curve  = new THREE.CatmullRomCurve3(cameraAnchors, false, 'catmullrom', 0.5)
const _pos   = new THREE.Vector3()
const _look  = new THREE.Vector3()
const _cur   = new THREE.Vector3()
const _quat  = new THREE.Quaternion()
const _mat   = new THREE.Matrix4()
const DAMP   = 3.5

export default function CameraRig({ tier }) {
  const { camera } = useThree()

  // Initialise camera to first anchor
  camera.position.copy(cameraAnchors[0])

  useFrame((_, delta) => {
    if (tier === 'static') return

    // Read scroll state without subscribing (no re-renders)
    const { progress } = useScrollStore.getState()

    // Map linear progress → eased progress (dwells near each node)
    const easedT = dwellEase(Math.max(0, Math.min(1, progress)))

    // Current and look-ahead positions on the curve
    curve.getPoint(easedT, _pos)
    curve.getPoint(Math.min(1, easedT + LOOK_AHEAD_T), _look)

    // Damp camera position
    camera.position.x = THREE.MathUtils.damp(camera.position.x, _pos.x, DAMP, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, _pos.y, DAMP, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, _pos.z, DAMP, delta)

    // LookAt via quaternion (avoids gimbal lock, keeps up vector stable)
    _cur.copy(camera.position)
    _mat.lookAt(_cur, _look, camera.up)
    _quat.setFromRotationMatrix(_mat)
    camera.quaternion.slerp(_quat, delta * DAMP)
  })

  return null
}
