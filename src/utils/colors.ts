import type { ColorTheme } from '../types/fireworks'

export const COLORS: Record<string, string[]> = {
  golden: [
    '#FFD700', '#FFA500', '#FF8C00', '#FFDAB9', '#F0E68C',
    '#FFEC8B', '#FFD93D', '#FFC125', '#FFB90F', '#FFD700'
  ],
  purple: [
    '#9B59B6', '#8E44AD', '#9400D3', '#DDA0DD', '#EE82EE',
    '#DA70D6', '#BA55D3', '#9932CC', '#8A2BE2', '#7B68EE'
  ],
  blue: [
    '#00BFFF', '#1E90FF', '#4169E1', '#6495ED', '#87CEEB',
    '#87CEFA', '#ADD8E6', '#B0E0E6', '#AFEEEE', '#00CED1'
  ],
  pink: [
    '#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB', '#FFE4E1',
    '#FFB6C1', '#FFC0CB', '#FFE4E1', '#FFEFD5', '#FFF0F5'
  ],
  rainbow: [
    '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF',
    '#4B0082', '#9400D3', '#FF1493', '#FFD700', '#00CED1'
  ],
  neon: [
    '#00FF7F', '#32CD32', '#00FA9A', '#7FFF00', '#ADFF2F',
    '#FF00FF', '#FF1493', '#FF69B4', '#00CED1', '#20B2AA'
  ],
  white: ['#FFFFFF', '#F0F0F0', '#E0E0E0', '#D0D0D0', '#C0C0C0'],
  random: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF']
}

export function getRandomColor(theme: ColorTheme): string {
  const colors = COLORS[theme] || COLORS.rainbow
  return colors[Math.floor(Math.random() * colors.length)]
}

export function getRandomRGB(): string {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  return `rgb(${r}, ${g}, ${b})`
}

export function getGradientColor(startColor: string, endColor: string, t: number): string {
  const start = hexToRgb(startColor)
  const end = hexToRgb(endColor)
  if (!start || !end) return startColor
  
  const r = Math.floor(start.r + (end.r - start.r) * t)
  const g = Math.floor(start.g + (end.g - start.g) * t)
  const b = Math.floor(start.b + (end.b - start.b) * t)
  return `rgb(${r}, ${g}, ${b})`
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

export function getComplementaryColor(color: string): string {
  const rgb = hexToRgb(color)
  if (!rgb) return '#ffffff'
  return `rgb(${255 - rgb.r}, ${255 - rgb.g}, ${255 - rgb.b})`
}