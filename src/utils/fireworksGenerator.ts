import type { Firework, Particle, FireworkType, ColorTheme } from '../types/fireworks'
import { getRandomColor, getRandomRGB } from './colors'
import { random, randomInt, polarToCartesian } from './math'

function getRealisticFireworkColor(): string {
  const colors = [
    '#40E0D0', '#00CED1', '#20B2AA', '#7FFF00', '#32CD32',
    '#FF69B4', '#FF1493', '#FF00FF', '#9932CC', '#8A2BE2',
    '#DAA520', '#FFD700', '#FFA500', '#FF8C00', '#F4A460'
  ]
  
  if (Math.random() > 0.95) {
    return '#FFFFFF'
  }
  
  return colors[Math.floor(Math.random() * colors.length)]
}

let fireworkId = 0

export function createFirework(
  x: number,
  y: number,
  type: FireworkType,
  colorTheme: ColorTheme
): Firework {
  const id = ++fireworkId
  const color = colorTheme === 'random' ? getRandomRGB() : getRandomColor(colorTheme)
  const targetY = random(y * 0.2, y * 0.5)
  const vy = -random(12, 20)

  return {
    id,
    type,
    x,
    y,
    targetY,
    vy,
    color,
    exploded: false,
    particles: [],
    trail: []
  }
}

export function explodeFirework(firework: Firework, colorTheme: ColorTheme): Particle[] {
  const particles: Particle[] = []
  const { x, y, type } = firework

  switch (type) {
    case 'circle':
      particles.push(...createCircleExplosion(x, y, colorTheme))
      break
    case 'chrysanthemum':
      particles.push(...createChrysanthemumExplosion(x, y, colorTheme))
      break
    case 'heart':
      particles.push(...createHeartExplosion(x, y, colorTheme))
      break
    case 'smile':
      particles.push(...createSmileExplosion(x, y, colorTheme))
      break
    case 'star':
      particles.push(...createStarExplosion(x, y, colorTheme))
      break
    case 'spiral':
      particles.push(...createSpiralExplosion(x, y, colorTheme))
      break
    case 'waterfall':
      particles.push(...createWaterfallExplosion(x, y, colorTheme))
      break
    case 'chain':
      particles.push(...createChainExplosion(x, y, colorTheme))
      break
    case 'giant':
      particles.push(...createGiantExplosion(x, y, colorTheme))
      break
    case 'rainbow':
      particles.push(...createRainbowExplosion(x, y))
      break
    default:
      particles.push(...createCircleExplosion(x, y, colorTheme))
  }

  return particles
}

function createCircleExplosion(x: number, y: number, _colorTheme: ColorTheme): Particle[] {
  const particles: Particle[] = []
  const count = randomInt(80, 120)
  
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + random(-0.2, 0.2)
    const speed = random(1.5, 4)
    const { x: vx, y: vy } = polarToCartesian(angle, speed)
    const color = getRealisticFireworkColor()
    
    particles.push({
      x,
      y,
      vx,
      vy,
      life: random(150, 220),
      maxLife: 220,
      color,
      size: random(1.5, 2.5),
      trail: [{ x, y }]
    })
  }
  
  return particles
}

function createChrysanthemumExplosion(x: number, y: number, _colorTheme: ColorTheme): Particle[] {
  const particles: Particle[] = []
  const petalCount = randomInt(5, 8)
  
  for (let petal = 0; petal < petalCount; petal++) {
    const baseAngle = (Math.PI * 2 * petal) / petalCount
    const petalParticles = randomInt(15, 22)
    
    for (let i = 0; i < petalParticles; i++) {
      const angle = baseAngle + random(-0.2, 0.2) + (i * 0.015)
      const speed = random(2, 5) * (1 - i * 0.02)
      const { x: vx, y: vy } = polarToCartesian(angle, speed)
      const color = getRealisticFireworkColor()
      
      particles.push({
        x,
        y,
        vx,
        vy,
        life: random(160, 240),
        maxLife: 240,
        color,
        size: random(1.2, 2.8),
        trail: [{ x, y }]
      })
    }
  }
  
  return particles
}

function createHeartExplosion(x: number, y: number, _colorTheme: ColorTheme): Particle[] {
  const particles: Particle[] = []
  const count = randomInt(100, 150)
  const colors = ['#FF6B6B', '#FF8E8E', '#FFB6B6', '#FF1493', '#FF69B4']
  
  for (let i = 0; i < count; i++) {
    const t = random(0, Math.PI * 2)
    const scale = random(3, 7)
    
    const heartX = 16 * Math.pow(Math.sin(t), 3) * scale
    const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale * 0.5
    
    const vx = heartX * random(0.05, 0.15)
    const vy = heartY * random(0.05, 0.15)
    
    particles.push({
      x,
      y,
      vx,
      vy,
      life: random(70, 110),
      maxLife: 110,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: random(2, 4),
      trail: [{ x, y }]
    })
  }
  
  return particles
}

function createSmileExplosion(x: number, y: number, colorTheme: ColorTheme): Particle[] {
  const particles: Particle[] = []
  
  for (let i = 0; i < 200; i++) {
    const angle = random(0, Math.PI * 2)
    const speed = random(1, 4)
    const { x: vx, y: vy } = polarToCartesian(angle, speed)
    
    let color = getRandomColor(colorTheme === 'random' ? 'rainbow' : colorTheme)
    
    if (angle > 0.5 && angle < 2.5) {
      const smileFactor = Math.sin((angle - 0.5) * (Math.PI / 2))
      if (smileFactor > 0.7) {
        color = '#FFD700'
      }
    }
    
    particles.push({
      x,
      y,
      vx,
      vy,
      life: random(60, 90),
      maxLife: 90,
      color,
      size: random(2, 4),
      trail: [{ x, y }]
    })
  }
  
  for (let i = 0; i < 30; i++) {
    const eyeOffset = i % 2 === 0 ? -30 : 30
    particles.push({
      x: x + eyeOffset,
      y: y - 20,
      vx: random(-2, 2),
      vy: random(-3, -1),
      life: random(40, 60),
      maxLife: 60,
      color: '#000000',
      size: random(3, 5),
      trail: [{ x: x + eyeOffset, y: y - 20 }]
    })
  }
  
  return particles
}

function createStarExplosion(x: number, y: number, _colorTheme: ColorTheme): Particle[] {
  const particles: Particle[] = []
  const points = randomInt(5, 7)
  
  for (let point = 0; point < points; point++) {
    const baseAngle = (Math.PI * 2 * point) / points
    const rays = randomInt(20, 30)
    
    for (let i = 0; i < rays; i++) {
      const angle = baseAngle + random(-0.15, 0.15)
      const speed = random(2.5, 5) * (1 - i * 0.02)
      const { x: vx, y: vy } = polarToCartesian(angle, speed)
      const color = getRealisticFireworkColor()
      
      particles.push({
        x,
        y,
        vx,
        vy,
        life: random(140, 200),
        maxLife: 200,
        color,
        size: random(1, 2),
        trail: [{ x, y }]
      })
    }
  }
  
  for (let i = 0; i < 40; i++) {
    const angle = random(0, Math.PI * 2)
    const speed = random(1, 2.5)
    const { x: vx, y: vy } = polarToCartesian(angle, speed)
    const color = Math.random() > 0.85 ? '#FFFFFF' : getRealisticFireworkColor()
    
    particles.push({
      x,
      y,
      vx,
      vy,
      life: random(180, 250),
      maxLife: 250,
      color,
      size: random(0.8, 1.5),
      trail: [{ x, y }]
    })
  }
  
  return particles
}

function createSpiralExplosion(x: number, y: number, _colorTheme: ColorTheme): Particle[] {
  const particles: Particle[] = []
  const turns = randomInt(2, 3)
  const count = randomInt(100, 140)
  
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * turns * i) / count + random(-0.08, 0.08)
    const speed = random(1.5, 3.5)
    const { x: vx, y: vy } = polarToCartesian(angle, speed)
    const color = getRealisticFireworkColor()
    
    particles.push({
      x,
      y,
      vx,
      vy,
      life: random(150, 220),
      maxLife: 220,
      color,
      size: random(1.2, 2.5),
      trail: [{ x, y }]
    })
  }
  
  return particles
}

function createWaterfallExplosion(x: number, y: number, colorTheme: ColorTheme): Particle[] {
  const particles: Particle[] = []
  const count = randomInt(100, 150)
  
  for (let i = 0; i < count; i++) {
    const offsetX = random(-50, 50)
    const speed = random(8, 15)
    
    particles.push({
      x: x + offsetX,
      y,
      vx: random(-1, 1),
      vy: speed,
      life: random(100, 150),
      maxLife: 150,
      color: colorTheme === 'random' ? getRandomRGB() : getRandomColor(colorTheme),
      size: random(2, 5),
      trail: [{ x: x + offsetX, y }]
    })
  }
  
  return particles
}

function createChainExplosion(x: number, y: number, colorTheme: ColorTheme): Particle[] {
  const particles: Particle[] = []
  const chainCount = randomInt(3, 5)
  let currentX = x
  let currentY = y
  
  for (let chain = 0; chain < chainCount; chain++) {
    const delay = chain * 10
    const count = randomInt(60, 80)
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + random(-0.1, 0.1)
      const speed = random(2, 5)
      const { x: vx, y: vy } = polarToCartesian(angle, speed)
      
      particles.push({
        x: currentX,
        y: currentY,
        vx,
        vy,
        life: random(50, 80) + delay,
        maxLife: 80 + delay,
        color: getRandomColor(colorTheme === 'random' ? 'rainbow' : colorTheme),
        size: random(2, 4),
        trail: [{ x: currentX, y: currentY }]
      })
    }
    
    currentX += random(-30, 30)
    currentY += random(-20, 10)
  }
  
  return particles
}

function createGiantExplosion(x: number, y: number, _colorTheme: ColorTheme): Particle[] {
  const particles: Particle[] = []
  const count = randomInt(150, 220)
  
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + random(-0.2, 0.2)
    const speed = random(1.2, 5)
    const { x: vx, y: vy } = polarToCartesian(angle, speed)
    const color = getRealisticFireworkColor()
    
    particles.push({
      x,
      y,
      vx,
      vy,
      life: random(160, 240),
      maxLife: 240,
      color,
      size: random(1.5, 3),
      trail: [{ x, y }]
    })
  }
  
  for (let i = 0; i < 50; i++) {
    const angle = random(0, Math.PI * 2)
    const speed = random(0.8, 2)
    const { x: vx, y: vy } = polarToCartesian(angle, speed)
    const color = Math.random() > 0.8 ? '#FFFFFF' : getRealisticFireworkColor()
    
    particles.push({
      x,
      y,
      vx,
      vy,
      life: random(200, 280),
      maxLife: 280,
      color,
      size: random(0.8, 1.5),
      trail: [{ x, y }]
    })
  }
  
  return particles
}

function createRainbowExplosion(x: number, y: number): Particle[] {
  const particles: Particle[] = []
  const count = randomInt(180, 240)
  const colors = [
    '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF',
    '#4B0082', '#9400D3'
  ]
  
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count
    const speed = random(2, 6)
    const { x: vx, y: vy } = polarToCartesian(angle, speed)
    const colorIndex = Math.floor((angle / (Math.PI * 2)) * colors.length)
    
    particles.push({
      x,
      y,
      vx,
      vy,
      life: random(60, 100),
      maxLife: 100,
      color: colors[colorIndex % colors.length],
      size: random(2, 5),
      trail: [{ x, y }]
    })
  }
  
  return particles
}

export function updateParticle(particle: Particle, gravity: number): boolean {
  particle.trail.push({ x: particle.x, y: particle.y })
  if (particle.trail.length > 10) particle.trail.shift()
  
  particle.vx *= 0.98
  particle.vy += gravity
  particle.x += particle.vx
  particle.y += particle.vy
  particle.life -= 1
  
  return particle.life > 0
}

export function updateFirework(firework: Firework, gravity: number): boolean {
  if (!firework.exploded) {
    firework.trail.push({ x: firework.x, y: firework.y, alpha: 1 })
    if (firework.trail.length > 20) firework.trail.shift()
    
    firework.vy += gravity * 0.3
    firework.y += firework.vy
    
    return firework.y > firework.targetY || firework.vy >= 0
  }
  
  return true
}