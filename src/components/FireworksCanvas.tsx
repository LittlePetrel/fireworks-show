import { useEffect, useRef, useCallback } from 'react'
import type { Firework, Particle, Star, MouseTrail, Smoke, FireworkType, ColorTheme } from '../types/fireworks'
import { createFirework, explodeFirework, updateParticle, updateFirework } from '../utils/fireworksGenerator'
import { random } from '../utils/math'
import { audioManager } from '../utils/audio'

interface FireworksCanvasProps {
  fireworkType: FireworkType
  colorTheme: ColorTheme
  autoMode: boolean
  rhythmMode: boolean
  showStars: boolean
  showMoon: boolean
  showCity: boolean
  showReflection: boolean
  cameraShake: boolean
}

export function FireworksCanvas({
  fireworkType,
  colorTheme,
  autoMode,
  rhythmMode,
  showStars,
  showMoon,
  showCity,
  showReflection,
  cameraShake
}: FireworksCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fireworksRef = useRef<Firework[]>([])
  const particlesRef = useRef<Particle[]>([])
  const starsRef = useRef<Star[]>([])
  const smokeRef = useRef<Smoke[]>([])
  const mouseTrailRef = useRef<MouseTrail[]>([])
  const mousePosRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>(0)
  const lastAutoSpawnRef = useRef(0)
  const shakeOffsetRef = useRef({ x: 0, y: 0 })
  const lastShakeRef = useRef(0)
  const activeFireworkCountRef = useRef(0)

  const initStars = useCallback((width: number, height: number) => {
    const stars: Star[] = []
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: random(0, width),
        y: random(0, height * 0.6),
        size: random(0.5, 2),
        twinkle: random(0, Math.PI * 2),
        twinkleSpeed: random(0.01, 0.03)
      })
    }
    starsRef.current = stars
  }, [])

  const drawStars = useCallback((ctx: CanvasRenderingContext2D) => {
    starsRef.current.forEach(star => {
      star.twinkle += star.twinkleSpeed
      const alpha = 0.3 + Math.sin(star.twinkle) * 0.7
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.fill()
    })
  }, [])

  const drawMoon = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const moonX = width * 0.8
    const moonY = height * 0.15
    const moonRadius = Math.min(width, height) * 0.08

    const gradient = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonRadius * 1.5)
    gradient.addColorStop(0, 'rgba(255, 255, 240, 0.9)')
    gradient.addColorStop(0.5, 'rgba(255, 255, 220, 0.3)')
    gradient.addColorStop(1, 'rgba(255, 255, 200, 0)')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(moonX, moonY, moonRadius * 1.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#FFFDE7'
    ctx.beginPath()
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = 'rgba(200, 200, 180, 0.3)'
    ctx.beginPath()
    ctx.arc(moonX - moonRadius * 0.2, moonY - moonRadius * 0.15, moonRadius * 0.25, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(moonX + moonRadius * 0.15, moonY + moonRadius * 0.1, moonRadius * 0.15, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(moonX + moonRadius * 0.3, moonY - moonRadius * 0.2, moonRadius * 0.1, 0, Math.PI * 2)
    ctx.fill()
  }, [])

  const drawCity = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const groundY = height * 0.85
    const buildingWidths: number[] = []
    let currentX = 0

    while (currentX < width) {
      const buildingWidth = random(20, 80)
      buildingWidths.push(buildingWidth)
      currentX += buildingWidth + random(5, 15)
    }

    currentX = 0
    buildingWidths.forEach(width => {
      const buildingHeight = random(60, 200)
      const buildingY = groundY - buildingHeight

      ctx.fillStyle = '#0a0a15'
      ctx.fillRect(currentX, buildingY, width, buildingHeight)

      const windowRows = Math.floor(buildingHeight / 25)
      const windowCols = Math.floor(width / 20)

      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          if (Math.random() > 0.3) {
            const windowX = currentX + 5 + col * 20
            const windowY = buildingY + 10 + row * 25
            const lightColor = Math.random() > 0.5 ? '#FFE4B5' : '#87CEEB'
            ctx.fillStyle = lightColor
            ctx.fillRect(windowX, windowY, 10, 12)
          }
        }
      }

      if (Math.random() > 0.7 && buildingHeight > 100) {
        ctx.fillStyle = '#FFD700'
        ctx.beginPath()
        ctx.moveTo(currentX + width / 2, buildingY - 15)
        ctx.lineTo(currentX + width / 2 - 5, buildingY)
        ctx.lineTo(currentX + width / 2 + 5, buildingY)
        ctx.fill()
      }

      currentX += width + random(5, 15)
    })

    ctx.fillStyle = '#050510'
    ctx.fillRect(0, groundY, width, height - groundY)
  }, [])

  const drawReflection = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const waterY = height * 0.85
    const waterHeight = height - waterY

    const gradient = ctx.createLinearGradient(0, waterY, 0, height)
    gradient.addColorStop(0, 'rgba(5, 15, 30, 0.6)')
    gradient.addColorStop(1, 'rgba(3, 10, 20, 0.9)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, waterY, width, waterHeight)

    for (let i = 0; i < 15; i++) {
      const x = random(0, width)
      const y = random(waterY, height)
      const alpha = random(0.05, 0.2)
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
      ctx.beginPath()
      ctx.arc(x, y, 1, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [])

  const createSmoke = useCallback((x: number, y: number) => {
    for (let i = 0; i < 25; i++) {
      smokeRef.current.push({
        x: x + random(-50, 50),
        y: y + random(-30, 30),
        size: random(10, 25),
        alpha: random(0.15, 0.3),
        vx: random(-0.8, 0.8),
        vy: random(-2, -0.8),
        rotation: random(0, Math.PI * 2),
        rotationSpeed: random(-0.02, 0.02),
        wobbleOffset: random(0, Math.PI * 2)
      })
    }
  }, [])

  const updateAndDrawSmoke = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    smokeRef.current = smokeRef.current.filter(smoke => {
      smoke.vx += Math.sin(time * 0.001 + smoke.wobbleOffset) * 0.01
      smoke.x += smoke.vx
      smoke.y += smoke.vy
      smoke.size += 0.25
      smoke.alpha -= 0.006

      if (smoke.alpha > 0) {
        const smokeGradient = ctx.createRadialGradient(smoke.x, smoke.y, 0, smoke.x, smoke.y, smoke.size)
        smokeGradient.addColorStop(0, `rgba(180, 180, 180, ${smoke.alpha * 0.3})`)
        smokeGradient.addColorStop(0.5, `rgba(120, 120, 120, ${smoke.alpha * 0.15})`)
        smokeGradient.addColorStop(1, 'rgba(80, 80, 80, 0)')
        
        ctx.beginPath()
        ctx.arc(smoke.x, smoke.y, smoke.size, 0, Math.PI * 2)
        ctx.fillStyle = smokeGradient
        ctx.fill()
        return true
      }
      return false
    })
  }, [])

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    const lifeRatio = particle.life / particle.maxLife
    const alpha = lifeRatio * 0.8

    const dotSize = particle.size * (0.15 + lifeRatio * 0.25)
    
    ctx.beginPath()
    ctx.arc(particle.x, particle.y, dotSize, 0, Math.PI * 2)
    ctx.fillStyle = particle.color
    ctx.globalAlpha = alpha
    ctx.fill()
    
    if (Math.random() > 0.9 && lifeRatio > 0.7) {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, dotSize * 0.3, 0, Math.PI * 2)
      ctx.fillStyle = '#FFFFFF'
      ctx.globalAlpha = alpha * 0.9
      ctx.fill()
    }
    
    ctx.globalAlpha = 1
  }, [])

  const drawFireworkTrail = useCallback((ctx: CanvasRenderingContext2D, firework: Firework) => {
    if (firework.trail.length < 2) return

    ctx.beginPath()
    ctx.moveTo(firework.trail[0].x, firework.trail[0].y)
    
    for (let i = 1; i < firework.trail.length; i++) {
      const point = firework.trail[i]
      ctx.lineTo(point.x, point.y)
    }

    ctx.strokeStyle = `${firework.color}40`
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.stroke()

    const lastPoint = firework.trail[firework.trail.length - 1]
    ctx.beginPath()
    ctx.arc(lastPoint.x, lastPoint.y, 4, 0, Math.PI * 2)
    ctx.fillStyle = firework.color
    ctx.fill()
  }, [])

  const drawCameraShake = useCallback((ctx: CanvasRenderingContext2D, _width: number, _height: number, time: number) => {
    if (!cameraShake) return

    const timeSinceShake = time - lastShakeRef.current
    if (timeSinceShake < 50) {
      const intensity = (50 - timeSinceShake) / 50 * 3
      shakeOffsetRef.current = {
        x: (Math.random() - 0.5) * intensity * 2,
        y: (Math.random() - 0.5) * intensity * 2
      }
    } else {
      shakeOffsetRef.current = { x: 0, y: 0 }
    }

    ctx.translate(shakeOffsetRef.current.x, shakeOffsetRef.current.y)
  }, [cameraShake])

  const launchFirework = useCallback((x: number, y: number, type?: FireworkType) => {
    const firework = createFirework(x, y, type || fireworkType, colorTheme)
    fireworksRef.current.push(firework)
    audioManager.playLaunchSound()
  }, [fireworkType, colorTheme])

  const handleClick = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    let clientX: number, clientY: number
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    if (y < canvas.height * 0.8) {
      launchFirework(x, y)
    }
  }, [launchFirework])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }

    mouseTrailRef.current.push({
      x: mousePosRef.current.x,
      y: mousePosRef.current.y,
      alpha: 1
    })

    if (mouseTrailRef.current.length > 20) {
      mouseTrailRef.current.shift()
    }
  }, [])

  const drawMouseTrail = useCallback((ctx: CanvasRenderingContext2D) => {
    mouseTrailRef.current.forEach((point, index) => {
      const alpha = point.alpha * (index / mouseTrailRef.current.length)
      ctx.beginPath()
      ctx.arc(point.x, point.y, 3 * alpha, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 200, 255, ${alpha})`
      ctx.fill()
    })

    mouseTrailRef.current = mouseTrailRef.current.map(point => ({
      ...point,
      alpha: point.alpha - 0.05
    })).filter(point => point.alpha > 0)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars(canvas.width, canvas.height)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    canvas.addEventListener('click', handleClick)
    canvas.addEventListener('touchstart', handleClick)
    canvas.addEventListener('mousemove', handleMouseMove)

    const animate = (time: number) => {
      ctx.save()

      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (showStars) {
        drawStars(ctx)
      }

      if (showMoon) {
        drawMoon(ctx, canvas.width, canvas.height)
      }

      drawCameraShake(ctx, canvas.width, canvas.height, time)

      activeFireworkCountRef.current = fireworksRef.current.filter(f => !f.exploded).length + 
                                        particlesRef.current.filter(p => p.life / p.maxLife > 0.3).length

      if (autoMode) {
        const spawnInterval = rhythmMode ? 2500 : random(3000, 5000)
        const maxActiveFireworks = 1
        
        if (time - lastAutoSpawnRef.current > spawnInterval && activeFireworkCountRef.current < maxActiveFireworks) {
          const types: FireworkType[] = ['circle', 'chrysanthemum', 'star', 'spiral', 'giant']
          const randomType = types[Math.floor(Math.random() * types.length)]
          launchFirework(random(canvas.width * 0.2, canvas.width * 0.8), canvas.height * random(0.85, 1), randomType)
          lastAutoSpawnRef.current = time
        }
      }

      fireworksRef.current = fireworksRef.current.filter(firework => {
        const shouldExplode = updateFirework(firework, 0.3)
        
        if (!firework.exploded && shouldExplode) {
          firework.exploded = true
          firework.particles = explodeFirework(firework, colorTheme)
          particlesRef.current.push(...firework.particles)
          audioManager.playExplosionSound()
          createSmoke(firework.x, firework.y)
          
          if (cameraShake) {
            lastShakeRef.current = time
          }
        }

        if (!firework.exploded) {
          drawFireworkTrail(ctx, firework)
        }

        return !firework.exploded || firework.particles.length > 0
      })

      particlesRef.current = particlesRef.current.filter(particle => {
        const alive = updateParticle(particle, 0.08)
        if (alive) {
          drawParticle(ctx, particle)
        }
        return alive
      })

      updateAndDrawSmoke(ctx, time)

      drawMouseTrail(ctx)

      const hasBrightParticles = particlesRef.current.some(p => p.life / p.maxLife > 0.7)
      if (hasBrightParticles) {
        ctx.fillStyle = 'rgba(20, 15, 10, 0.05)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.globalCompositeOperation = 'screen'
      const vignetteGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      )
      vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      vignetteGradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.3)')
      vignetteGradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)')
      ctx.fillStyle = vignetteGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.globalCompositeOperation = 'source-over'
      
      for (let i = 0; i < 500; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const alpha = Math.random() * 0.03
        ctx.fillStyle = `rgba(200, 200, 220, ${alpha})`
        ctx.fillRect(x, y, 1, 1)
      }

      ctx.restore()

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('click', handleClick)
      canvas.removeEventListener('touchstart', handleClick)
      canvas.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationRef.current)
    }
  }, [
    showStars,
    showMoon,
    showCity,
    showReflection,
    cameraShake,
    autoMode,
    rhythmMode,
    colorTheme,
    initStars,
    drawStars,
    drawMoon,
    drawCity,
    drawReflection,
    drawParticle,
    drawFireworkTrail,
    drawCameraShake,
    drawMouseTrail,
    handleClick,
    handleMouseMove,
    launchFirework,
    updateAndDrawSmoke,
    createSmoke
  ])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block'
      }}
    />
  )
}