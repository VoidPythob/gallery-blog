<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  alpha: number
  color: string
}

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)
const isEnabled = shallowRef(false)

const particles: Particle[] = []

let animationFrame = 0
let ctx: CanvasRenderingContext2D | null = null
let dpr = 1
let width = 0
let height = 0
let lastSpawnTime = 0

const MAX_PARTICLES = 84
const MOVE_SPAWN_INTERVAL = 16

const parseAccentColor = () => {
  if (typeof window === 'undefined') {
    return [99, 102, 241] as const
  }

  const accent = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent-color')
    .trim()

  if (!accent) {
    return [99, 102, 241] as const
  }

  if (accent.startsWith('#')) {
    const hex = accent.slice(1)
    const normalized = hex.length === 3
      ? hex
          .split('')
          .map((item) => item + item)
          .join('')
      : hex.slice(0, 6)

    const value = Number.parseInt(normalized, 16)

    if (!Number.isNaN(value)) {
      return [(value >> 16) & 255, (value >> 8) & 255, value & 255] as const
    }
  }

  const rgbMatch = accent.match(/rgba?\(([^)]+)\)/i)

  if (rgbMatch) {
    const [r = '99', g = '102', b = '241'] = rgbMatch[1].split(',').map((item) => item.trim())
    return [Number.parseFloat(r), Number.parseFloat(g), Number.parseFloat(b)] as const
  }

  return [99, 102, 241] as const
}

const createParticle = (x: number, y: number, burst = false) => {
  const [r, g, b] = parseAccentColor()
  const angle = Math.random() * Math.PI * 2
  const speed = burst ? 0.8 + Math.random() * 2.6 : 0.25 + Math.random() * 1.4
  const maxLife = burst ? 42 + Math.random() * 18 : 28 + Math.random() * 16

  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - (burst ? 0.15 : 0.05),
    size: burst ? 2 + Math.random() * 5 : 1.5 + Math.random() * 3,
    life: maxLife,
    maxLife,
    alpha: burst ? 0.9 : 0.72,
    color: `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 1)`,
  } satisfies Particle
}

const trimParticles = () => {
  if (particles.length <= MAX_PARTICLES) {
    return
  }

  particles.splice(0, particles.length - MAX_PARTICLES)
}

const spawnTrail = (x: number, y: number) => {
  particles.push(createParticle(x, y))
  particles.push(createParticle(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10))
  trimParticles()
}

const spawnBurst = (x: number, y: number) => {
  for (let index = 0; index < 14; index += 1) {
    particles.push(
      createParticle(
        x + (Math.random() - 0.5) * 12,
        y + (Math.random() - 0.5) * 12,
        true,
      ),
    )
  }

  trimParticles()
}

const resizeCanvas = () => {
  const canvas = canvasRef.value

  if (!canvas) {
    return
  }

  dpr = window.devicePixelRatio || 1
  width = window.innerWidth
  height = window.innerHeight

  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  ctx = canvas.getContext('2d')

  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
}

const drawFrame = () => {
  if (!ctx) {
    animationFrame = window.requestAnimationFrame(drawFrame)
    return
  }

  ctx.clearRect(0, 0, width, height)

  for (let index = particles.length - 1; index >= 0; index -= 1) {
    const particle = particles[index]
    particle.life -= 1

    if (particle.life <= 0) {
      particles.splice(index, 1)
      continue
    }

    particle.x += particle.vx
    particle.y += particle.vy
    particle.vy += 0.01

    const progress = particle.life / particle.maxLife
    const size = particle.size * (0.45 + progress)
    const alpha = particle.alpha * progress

    ctx.beginPath()
    ctx.fillStyle = particle.color.replace(', 1)', `, ${alpha})`)
    ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2)
    ctx.fill()
  }

  animationFrame = window.requestAnimationFrame(drawFrame)
}

const onPointerMove = (event: PointerEvent) => {
  if (!isEnabled.value) {
    return
  }

  const now = performance.now()

  if (now - lastSpawnTime < MOVE_SPAWN_INTERVAL) {
    return
  }

  lastSpawnTime = now
  spawnTrail(event.clientX, event.clientY)
}

const onPointerDown = (event: PointerEvent) => {
  if (!isEnabled.value) {
    return
  }

  spawnBurst(event.clientX, event.clientY)
}

const onVisibilityChange = () => {
  if (!document.hidden) {
    return
  }

  particles.length = 0
}

onMounted(() => {
  if (typeof window === 'undefined') {
    return
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const supportsHover = window.matchMedia('(hover: hover)').matches
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches

  isEnabled.value = !prefersReducedMotion && supportsHover && hasFinePointer

  resizeCanvas()

  if (!isEnabled.value) {
    return
  }

  window.addEventListener('resize', resizeCanvas, { passive: true })
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('pointerdown', onPointerDown, { passive: true })
  document.addEventListener('visibilitychange', onVisibilityChange)
  animationFrame = window.requestAnimationFrame(drawFrame)
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') {
    return
  }

  window.cancelAnimationFrame(animationFrame)
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <canvas
    v-show="isEnabled"
    ref="canvasRef"
    class="mouse-particles"
    aria-hidden="true"
  />
</template>

<style scoped>
.mouse-particles {
  position: fixed;
  inset: 0;
  z-index: 3;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
}
</style>
