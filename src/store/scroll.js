/**
 * @file store/scroll.js
 * @description Zustand store for scroll progress.
 * Values are written by GSAP ScrollTrigger (DOM side)
 * and read by scene code via useScrollStore.getState() inside useFrame —
 * never via hooks, to avoid re-renders on every scroll tick.
 */

import { create } from 'zustand'

/**
 * @typedef {Object} ScrollState
 * @property {number} progress        - Overall scroll progress [0, 1]
 * @property {number} sectionIndex    - Active section index (integer)
 * @property {number[]} sectionProgress - Per-section progress [0, 1], length = 6
 * @property {(progress: number, sectionIndex: number, sectionProgress: number[]) => void} setScroll
 */

/** @type {import('zustand').UseBoundStore<import('zustand').StoreApi<ScrollState>>} */
export const useScrollStore = create((set) => ({
  progress: 0,
  sectionIndex: 0,
  sectionProgress: [0, 0, 0, 0, 0, 0],

  /**
   * Called each frame by the GSAP ScrollTrigger listener.
   * Intentionally NOT using immer or deep merge — plain assignment
   * keeps the update path as fast as possible.
   */
  setScroll: (progress, sectionIndex, sectionProgress) =>
    set({ progress, sectionIndex, sectionProgress }),
}))
