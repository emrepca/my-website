/**
 * Global Vitest setup.
 *
 * Runs once per worker. Adds jest-dom matchers and stubs heavy/animation
 * dependencies (framer-motion, next/image) so that jsdom-based tests stay
 * focused on logic & accessibility rather than animation timing.
 */
import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import React from 'react'

afterEach(() => {
  cleanup()
})

// framer-motion — replace motion components with plain elements and stub hooks.
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion')

  type AnyProps = Record<string, unknown>

  const stripMotionProps = (props: AnyProps): AnyProps => {
    const {
      initial: _initial,
      animate: _animate,
      exit: _exit,
      whileHover: _whileHover,
      whileTap: _whileTap,
      whileInView: _whileInView,
      transition: _transition,
      variants: _variants,
      viewport: _viewport,
      layout: _layout,
      layoutId: _layoutId,
      drag: _drag,
      dragConstraints: _dragConstraints,
      ...rest
    } = props
    void _initial
    void _animate
    void _exit
    void _whileHover
    void _whileTap
    void _whileInView
    void _transition
    void _variants
    void _viewport
    void _layout
    void _layoutId
    void _drag
    void _dragConstraints
    return rest
  }

  const motionFactory = new Proxy(
    {},
    {
      get: (_target, tag: string) => {
        return React.forwardRef<unknown, AnyProps>(({ children, ...props }, ref) =>
          React.createElement(tag, { ref, ...stripMotionProps(props) }, children as React.ReactNode),
        )
      },
    },
  )

  return {
    ...actual,
    motion: motionFactory,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useInView: () => true,
    useReducedMotion: () => true,
    useScroll: () => ({ scrollY: { get: () => 0, on: () => () => {} } }),
    useTransform: () => 0,
  }
})

// next/image — render a plain <img> in jsdom (no Next runtime present).
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...rest }: { src: string; alt: string }) =>
    React.createElement('img', { src, alt, ...rest }),
}))

// Intl.RelativeTimeFormat exists in jsdom but be defensive about polyfilling.
if (typeof globalThis.matchMedia !== 'function') {
  globalThis.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}
