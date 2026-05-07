import { useEffect, useRef } from 'react'
import { audioManager } from '../utils/audio'

export default function CinematicFireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    audioManager.init()

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    let rafId: number
    let autoLaunch: ReturnType<typeof setInterval>

    const rockets: Rocket[] = []
    const explosions: Explosion[] = []

    const stars = Array.from({ length: 140 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.7,
      r: Math.random() * 1.2,
      a: Math.random() * 0.4,
    }))

    function drawSky() {
      const g = ctx!.createLinearGradient(0, 0, 0, height)
      g.addColorStop(0, '#0b1020')
      g.addColorStop(0.5, '#05060a')
      g.addColorStop(1, '#020204')
      ctx!.fillStyle = g
      ctx!.fillRect(0, 0, width, height)
    }

    function drawStars() {
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        ctx!.beginPath()
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(255,255,255,${s.a})`
        ctx!.shadowBlur = 1
        ctx!.shadowColor = 'white'
        ctx!.fill()
      }
      ctx!.shadowBlur = 0
    }

    function drawHaze() {
      const haze = ctx!.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        width
      )
      haze.addColorStop(0, 'rgba(40,60,120,0.08)')
      haze.addColorStop(1, 'rgba(0,0,0,0.7)')
      ctx!.fillStyle = haze
      ctx!.fillRect(0, 0, width, height)
    }

    class Rocket {
      x: number
      y: number
      vx: number
      vy: number
      gravity: number
      friction: number
      trail: { x: number; y: number; alpha: number }[]
      color: string
      exploded: boolean
      wobble: number
      wobbleSpeed: number

      constructor(x: number) {
        this.x = x
        this.y = height
        this.vx = (Math.random() - 0.5) * 0.8
        this.vy = -(Math.random() * 7 + 12)
        this.gravity = 0.12
        this.friction = 0.995
        this.trail = []
        this.color = `hsl(${Math.random() * 60 + 40}, 80%, 65%)`
        this.exploded = false
        this.wobble = 0
        this.wobbleSpeed = 0.15 + Math.random() * 0.1
      }

      update() {
        this.wobble += this.wobbleSpeed
        const wobbleX = Math.sin(this.wobble) * 1.5

        this.trail.push({ x: this.x + wobbleX, y: this.y, alpha: 1 })
        if (this.trail.length > 25) this.trail.shift()

        this.vy += this.gravity
        this.vx *= this.friction
        this.vy *= this.friction
        this.x += this.vx + Math.sin(this.wobble) * 0.3
        this.y += this.vy

        this.trail.forEach((p, i) => {
          p.alpha = (i + 1) / this.trail.length * 0.8
        })

        if (this.vy > -1) {
          this.exploded = true
          explosions.push(new Explosion(this.x, this.y, this.color))
          audioManager.playExplosionSound()
        }
      }

      draw() {
        for (let i = 0; i < this.trail.length; i++) {
          const p = this.trail[i]
          const size = 1.5 * p.alpha

          ctx!.beginPath()
          ctx!.arc(p.x, p.y, size, 0, Math.PI * 2)
          ctx!.fillStyle = this.color
          ctx!.globalAlpha = p.alpha
          ctx!.fill()

          if (Math.random() > 0.7) {
            ctx!.beginPath()
            ctx!.arc(p.x + (Math.random() - 0.5) * 3, p.y + (Math.random() - 0.5) * 3, size * 0.5, 0, Math.PI * 2)
            ctx!.fillStyle = '#FFFFFF'
            ctx!.globalAlpha = p.alpha * 0.7
            ctx!.fill()
          }
        }

        ctx!.beginPath()
        ctx!.arc(this.x, this.y, 2, 0, Math.PI * 2)
        ctx!.fillStyle = '#FFFFFF'
        ctx!.globalAlpha = 1
        ctx!.shadowBlur = 10
        ctx!.shadowColor = this.color
        ctx!.fill()
        ctx!.shadowBlur = 0
      }
    }

    class Explosion {
      particles: {
        x: number
        y: number
        vx: number
        vy: number
        life: number
        decay: number
        size: number
      }[]
      color: string

      constructor(x: number, y: number, color: string) {
        this.particles = []
        this.color = color

        const count = 140

        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2
          const speed = Math.pow(Math.random(), 0.35) * 6

          this.particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 100,
            decay: 0.012 + Math.random() * 0.01,
            size: Math.random() * 2 + 1,
          })
        }
      }

      update() {
        this.particles.forEach(p => {
          p.vy += 0.04
          p.vx *= 0.985
          p.vy *= 0.985
          p.x += p.vx
          p.y += p.vy
          p.life -= p.decay * 60
        })
        this.particles = this.particles.filter(p => p.life > 0)
      }

      draw() {
        this.particles.forEach(p => {
          const a = Math.max(p.life / 100, 0)
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx!.fillStyle = this.color
          ctx!.globalAlpha = a
          ctx!.shadowBlur = 25 * a
          ctx!.shadowColor = this.color
          ctx!.fill()
        })
        ctx!.globalAlpha = 1
      }
    }

    function launchRocket() {
      rockets.push(new Rocket(Math.random() * width))
    }

    function animate() {
      ctx!.fillStyle = 'rgba(0,0,0,0.14)'
      ctx!.fillRect(0, 0, width, height)

      drawSky()
      drawStars()
      drawHaze()

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.update()
        r.draw()
        if (r.exploded) rockets.splice(i, 1)
      }

      for (let i = explosions.length - 1; i >= 0; i--) {
        const e = explosions[i]
        e.update()
        e.draw()
        if (e.particles.length === 0) explosions.splice(i, 1)
      }

      rafId = requestAnimationFrame(animate)
    }

    animate()

    autoLaunch = setInterval(() => {
      launchRocket()
    }, 650)

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(rafId)
      clearInterval(autoLaunch)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        background: 'black',
      }}
    />
  )
}