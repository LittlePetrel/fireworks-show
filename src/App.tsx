import { useState, useEffect } from 'react'
import CinematicFireworks from './components/CinematicFireworks'
import './App.css'

function App() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [fps, setFps] = useState(60)

  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()
    let animationId: number

    const measureFps = (currentTime: number) => {
      frameCount++
      const elapsed = currentTime - lastTime

      if (elapsed >= 1000) {
        setFps(Math.round(frameCount * 1000 / elapsed))
        frameCount = 0
        lastTime = currentTime
      }

      animationId = requestAnimationFrame(measureFps)
    }

    animationId = requestAnimationFrame(measureFps)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  }

  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas')
    if (canvas) {
      const link = document.createElement('a')
      link.download = `fireworks-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <div className="app">
      <CinematicFireworks />

      {showWelcome && (
        <div className="welcome-overlay" onClick={() => setShowWelcome(false)}>
          <div className="welcome-content">
            <h1 className="title">🎆 沉浸式烟花秀</h1>
            <p className="subtitle">电影级视觉效果，沉浸体验</p>
            <div className="welcome-hints">
              <span>🖱️ 自动播放中</span>
              <span>🎬 电影级画质</span>
              <span>🌌 星空背景</span>
            </div>
            <button className="welcome-btn" onClick={(e) => {
              e.stopPropagation()
              setShowWelcome(false)
            }}>
              开始欣赏
            </button>
          </div>
        </div>
      )}

      <div className="action-bar">
        <button className="action-btn" onClick={handleFullscreen} title="全屏">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 15l5-5 5 5M7 9l5 5 5-5" />
          </svg>
        </button>
        <button className="action-btn" onClick={handleScreenshot} title="截图保存">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>
        <div className="fps-display">
          {fps} FPS
        </div>
      </div>

      <div className="footer">
        <p>电影级烟花特效 · 自动播放中</p>
      </div>
    </div>
  )
}

export default App