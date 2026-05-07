export type FireworkType =
  | 'circle'
  | 'chrysanthemum'
  | 'heart'
  | 'smile'
  | 'star'
  | 'spiral'
  | 'waterfall'
  | 'chain'
  | 'giant'
  | 'rainbow'

export type ColorTheme =
  | 'golden'
  | 'purple'
  | 'blue'
  | 'pink'
  | 'rainbow'
  | 'neon'
  | 'random'

export interface Vector2D {
  x: number
  y: number
}

export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
  trail: { x: number; y: number }[]
}

export interface Firework {
  id: number
  type: FireworkType
  x: number
  y: number
  targetY: number
  vy: number
  color: string
  exploded: boolean
  particles: Particle[]
  trail: { x: number; y: number; alpha: number }[]
}

export interface Star {
  x: number
  y: number
  size: number
  twinkle: number
  twinkleSpeed: number
}

export interface Smoke {
  x: number
  y: number
  size: number
  alpha: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  wobbleOffset: number
}

export interface MouseTrail {
  x: number
  y: number
  alpha: number
}

export interface FireworksConfig {
  fireworkType: FireworkType
  colorTheme: ColorTheme
  autoMode: boolean
  rhythmMode: boolean
  volume: number
  showStars: boolean
  showMoon: boolean
  showCity: boolean
  showReflection: boolean
  bloomEnabled: boolean
  blurEnabled: boolean
  cameraShake: boolean
}