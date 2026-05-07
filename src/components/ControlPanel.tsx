import { useState } from 'react'
import type { FireworkType, ColorTheme, FireworksConfig } from '../types/fireworks'

interface ControlPanelProps {
  config: FireworksConfig
  onConfigChange: (config: FireworksConfig) => void
  onTogglePanel: () => void
  isOpen: boolean
}

const FIREWORK_TYPES: { value: FireworkType; label: string; emoji: string }[] = [
  { value: 'circle', label: '圆形', emoji: '⭕' },
  { value: 'chrysanthemum', label: '菊花', emoji: '🌸' },
  { value: 'heart', label: '爱心', emoji: '❤️' },
  { value: 'smile', label: '笑脸', emoji: '😊' },
  { value: 'star', label: '星星', emoji: '⭐' },
  { value: 'spiral', label: '螺旋', emoji: '🌀' },
  { value: 'waterfall', label: '瀑布', emoji: '💧' },
  { value: 'chain', label: '连环', emoji: '🔗' },
  { value: 'giant', label: '巨型', emoji: '💥' },
  { value: 'rainbow', label: '彩虹', emoji: '🌈' }
]

const COLOR_THEMES: { value: ColorTheme; label: string; color: string }[] = [
  { value: 'golden', label: '金色', color: '#FFD700' },
  { value: 'purple', label: '紫色', color: '#9B59B6' },
  { value: 'blue', label: '蓝色', color: '#3498DB' },
  { value: 'pink', label: '粉色', color: '#FF69B4' },
  { value: 'rainbow', label: '彩虹', color: '#FF0000' },
  { value: 'neon', label: '霓虹', color: '#00FF7F' },
  { value: 'random', label: '随机', color: '#FFFFFF' }
]

export function ControlPanel({ config, onConfigChange, onTogglePanel, isOpen }: ControlPanelProps) {
  const [activeSection, setActiveSection] = useState<'firework' | 'effects' | 'display'>('firework')

  const handleChange = <K extends keyof FireworksConfig>(key: K, value: FireworksConfig[K]) => {
    onConfigChange({ ...config, [key]: value })
  }

  return (
    <>
      <button
        onClick={onTogglePanel}
        className="toggle-button"
        aria-label={isOpen ? '关闭控制面板' : '打开控制面板'}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isOpen ? (
            <path d="M15 18l-6-6 6-6" />
          ) : (
            <path d="M9 6l6 6-6 6" />
          )}
        </svg>
      </button>

      <div className={`control-panel ${isOpen ? 'open' : 'closed'}`}>
        <div className="panel-header">
          <h2>🎆 烟花秀控制</h2>
          <button onClick={onTogglePanel} className="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="panel-tabs">
          <button
            className={`tab ${activeSection === 'firework' ? 'active' : ''}`}
            onClick={() => setActiveSection('firework')}
          >
            🎇 烟花
          </button>
          <button
            className={`tab ${activeSection === 'effects' ? 'active' : ''}`}
            onClick={() => setActiveSection('effects')}
          >
            ✨ 效果
          </button>
          <button
            className={`tab ${activeSection === 'display' ? 'active' : ''}`}
            onClick={() => setActiveSection('display')}
          >
            🌙 显示
          </button>
        </div>

        <div className="panel-content">
          {activeSection === 'firework' && (
            <div className="section">
              <div className="section-header">
                <h3>烟花类型</h3>
              </div>
              <div className="firework-grid">
                {FIREWORK_TYPES.map(({ value, label, emoji }) => (
                  <button
                    key={value}
                    className={`firework-btn ${config.fireworkType === value ? 'active' : ''}`}
                    onClick={() => handleChange('fireworkType', value)}
                    title={label}
                  >
                    <span className="emoji">{emoji}</span>
                    <span className="label">{label}</span>
                  </button>
                ))}
              </div>

              <div className="section-header">
                <h3>颜色主题</h3>
              </div>
              <div className="color-grid">
                {COLOR_THEMES.map(({ value, label, color }) => (
                  <button
                    key={value}
                    className={`color-btn ${config.colorTheme === value ? 'active' : ''}`}
                    onClick={() => handleChange('colorTheme', value)}
                    title={label}
                    style={{ '--color': color } as React.CSSProperties}
                  >
                    <span className="color-dot"></span>
                    <span className="label">{label}</span>
                  </button>
                ))}
              </div>

              <div className="toggle-row">
                <span className="toggle-label">
                  <span className="icon">🔄</span>
                  自动播放
                </span>
                <button
                  className={`toggle-switch ${config.autoMode ? 'active' : ''}`}
                  onClick={() => handleChange('autoMode', !config.autoMode)}
                >
                  <div className="toggle-thumb"></div>
                </button>
              </div>

              <div className="toggle-row">
                <span className="toggle-label">
                  <span className="icon">🎵</span>
                  节奏模式
                </span>
                <button
                  className={`toggle-switch ${config.rhythmMode ? 'active' : ''}`}
                  onClick={() => handleChange('rhythmMode', !config.rhythmMode)}
                >
                  <div className="toggle-thumb"></div>
                </button>
              </div>
            </div>
          )}

          {activeSection === 'effects' && (
            <div className="section">
              <div className="toggle-row">
                <span className="toggle-label">
                  <span className="icon">✨</span>
                  发光效果
                </span>
                <button
                  className={`toggle-switch ${config.bloomEnabled ? 'active' : ''}`}
                  onClick={() => handleChange('bloomEnabled', !config.bloomEnabled)}
                >
                  <div className="toggle-thumb"></div>
                </button>
              </div>

              <div className="toggle-row">
                <span className="toggle-label">
                  <span className="icon">💫</span>
                  动态模糊
                </span>
                <button
                  className={`toggle-switch ${config.blurEnabled ? 'active' : ''}`}
                  onClick={() => handleChange('blurEnabled', !config.blurEnabled)}
                >
                  <div className="toggle-thumb"></div>
                </button>
              </div>

              <div className="toggle-row">
                <span className="toggle-label">
                  <span className="icon">📹</span>
                  镜头震动
                </span>
                <button
                  className={`toggle-switch ${config.cameraShake ? 'active' : ''}`}
                  onClick={() => handleChange('cameraShake', !config.cameraShake)}
                >
                  <div className="toggle-thumb"></div>
                </button>
              </div>
            </div>
          )}

          {activeSection === 'display' && (
            <div className="section">
              <div className="toggle-row">
                <span className="toggle-label">
                  <span className="icon">⭐</span>
                  星空
                </span>
                <button
                  className={`toggle-switch ${config.showStars ? 'active' : ''}`}
                  onClick={() => handleChange('showStars', !config.showStars)}
                >
                  <div className="toggle-thumb"></div>
                </button>
              </div>

              <div className="toggle-row">
                <span className="toggle-label">
                  <span className="icon">🌙</span>
                  月亮
                </span>
                <button
                  className={`toggle-switch ${config.showMoon ? 'active' : ''}`}
                  onClick={() => handleChange('showMoon', !config.showMoon)}
                >
                  <div className="toggle-thumb"></div>
                </button>
              </div>

              <div className="toggle-row">
                <span className="toggle-label">
                  <span className="icon">🏙️</span>
                  城市剪影
                </span>
                <button
                  className={`toggle-switch ${config.showCity ? 'active' : ''}`}
                  onClick={() => handleChange('showCity', !config.showCity)}
                >
                  <div className="toggle-thumb"></div>
                </button>
              </div>

              <div className="toggle-row">
                <span className="toggle-label">
                  <span className="icon">🌊</span>
                  湖面倒影
                </span>
                <button
                  className={`toggle-switch ${config.showReflection ? 'active' : ''}`}
                  onClick={() => handleChange('showReflection', !config.showReflection)}
                >
                  <div className="toggle-thumb"></div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}