class AudioManager {
  private audioContext: AudioContext | null = null
  private volume: number = 0.5

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol))
  }

  playRocketSound() {
    if (!this.audioContext) return

    const ctx = this.audioContext
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(150, ctx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.8)

    gainNode.gain.setValueAtTime(0.15 * this.volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.8)
  }

  playLaunchSound() {
    this.playRocketSound()
  }

  playExplosionSound() {
    if (!this.audioContext) return

    const ctx = this.audioContext
    
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1
    }

    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2000, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3)

    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(0.25 * this.volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

    noise.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)

    noise.start(ctx.currentTime)

    const bassOsc = ctx.createOscillator()
    const bassGain = ctx.createGain()
    
    bassOsc.type = 'sine'
    bassOsc.frequency.setValueAtTime(80, ctx.currentTime)
    bassOsc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2)
    
    bassGain.gain.setValueAtTime(0.15 * this.volume, ctx.currentTime)
    bassGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
    
    bassOsc.connect(bassGain)
    bassGain.connect(ctx.destination)
    
    bassOsc.start(ctx.currentTime)
    bassOsc.stop(ctx.currentTime + 0.2)
  }
}

export const audioManager = new AudioManager()