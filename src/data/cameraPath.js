/**
 * @file cameraPath.js
 * @description Camera spline anchor points — one per section.
 * Positions are in Three.js world space (Y-up, right-hand).
 * Adjust these vectors to reframe 3D elements for each section.
 *
 * To change the path: edit the x/y/z values.
 * The CatmullRomCurve3 in CameraRig.jsx will automatically
 * refit the spline through whatever anchors you provide here.
 */

import * as THREE from 'three'

/**
 * One anchor per section, in scroll order.
 * @type {THREE.Vector3[]}
 */
export const cameraAnchors = [
  new THREE.Vector3(0,   0,  10),   // 0 – Hero      (looking at Text3D ANKUR)
  new THREE.Vector3(-4,  2,   6),   // 1 – About     (orbiting the brain)
  new THREE.Vector3( 6,  1,   4),   // 2 – Skills    (viewing the constellation)
  new THREE.Vector3( 2, -1,   6),   // 3 – Experience (along the glowing path)
  new THREE.Vector3(-2,  0,   8),   // 4 – Projects  (wide view)
  new THREE.Vector3( 0, -2,   6),   // 5 – Contact   (final orbs)
]

/**
 * Look-at offsets: the camera focuses this far *ahead* on the curve.
 * Increase to make the camera lead its target; decrease for tighter tracking.
 */
export const LOOK_AHEAD_T = 0.02

/**
 * Dwell easing: maps linear scroll progress → eased progress.
 * Creates "gravity wells" that slow the camera near each node.
 *
 * @param {number} t  - Linear scroll progress [0, 1]
 * @returns {number}  - Eased progress [0, 1]
 */
export function dwellEase(t) {
  // Smooth-step between each anchor band so the camera lingers
  const n = cameraAnchors.length - 1
  const band = t * n
  const i = Math.min(Math.floor(band), n - 1)
  const f = band - i
  // Smoothstep within each band for a cubic dwell
  const s = f * f * (3 - 2 * f)
  return (i + s) / n
}
