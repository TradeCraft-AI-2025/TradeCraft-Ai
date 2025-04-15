"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function PremiumBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Grid parameters
    const gridSize = 40
    const gridOpacity = 0.05

    // Particle parameters
    const particles: Particle[] = []
    const particleCount = 100
    const connectionDistance = 150
    const connectionOpacity = 0.05

    // Create particles
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      isGold: boolean

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.3
        this.speedY = (Math.random() - 0.5) * 0.3

        // 20% chance of being a gold particle
        this.isGold = Math.random() < 0.2

        if (this.isGold) {
          // Gold particles
          const goldHue = 40 + Math.random() * 10 // Gold hue range
          const goldSat = 80 + Math.random() * 20 // High saturation
          const goldLight = 60 + Math.random() * 20 // Medium-high lightness
          this.color = `hsla(${goldHue}, ${goldSat}%, ${goldLight}%, ${Math.random() * 0.4 + 0.2})`
        } else {
          // Cyan particles
          const cyanHue = 175 + Math.random() * 10 // Cyan hue range
          const cyanSat = 80 + Math.random() * 20 // High saturation
          const cyanLight = 60 + Math.random() * 20 // Medium-high lightness
          this.color = `hsla(${cyanHue}, ${cyanSat}%, ${cyanLight}%, ${Math.random() * 0.4 + 0.2})`
        }
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Wrap around edges
        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Draw grid
    function drawGrid() {
      if (!ctx || !canvas) return

      // Draw vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        const isSpecialLine = x % (gridSize * 5) === 0
        ctx.strokeStyle = isSpecialLine
          ? `rgba(212, 175, 55, ${gridOpacity * 1.5})` // Gold for every 5th line
          : `rgba(94, 234, 212, ${gridOpacity})` // Cyan for regular lines

        ctx.lineWidth = isSpecialLine ? 0.5 : 0.3
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Draw horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        const isSpecialLine = y % (gridSize * 5) === 0
        ctx.strokeStyle = isSpecialLine
          ? `rgba(212, 175, 55, ${gridOpacity * 1.5})` // Gold for every 5th line
          : `rgba(94, 234, 212, ${gridOpacity})` // Cyan for regular lines

        ctx.lineWidth = isSpecialLine ? 0.5 : 0.3
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    // Draw connections between particles
    function drawConnections() {
      if (!ctx) return

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance

            // Determine connection color based on particle types
            let connectionColor
            if (particles[i].isGold && particles[j].isGold) {
              // Gold to gold connection
              connectionColor = `rgba(212, 175, 55, ${opacity * connectionOpacity * 1.5})`
            } else if (!particles[i].isGold && !particles[j].isGold) {
              // Cyan to cyan connection
              connectionColor = `rgba(94, 234, 212, ${opacity * connectionOpacity})`
            } else {
              // Mixed connection - gradient effect
              connectionColor = `rgba(180, 200, 180, ${opacity * connectionOpacity})`
            }

            ctx.strokeStyle = connectionColor
            ctx.lineWidth = 0.3
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop
    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "rgba(10, 10, 20, 1)")
      gradient.addColorStop(1, "rgba(5, 15, 30, 1)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      drawGrid()

      // Update and draw particles
      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      // Draw connections
      drawConnections()

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full opacity-30 z-0" />

      {/* Glowing accent elements */}
      <motion.div
        className="fixed top-[20%] right-[10%] w-32 h-32 rounded-full bg-cyan-500/5 blur-3xl z-0"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="fixed bottom-[30%] left-[15%] w-64 h-64 rounded-full bg-[#D4AF37]/5 blur-3xl z-0"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          repeatDelay: 2,
        }}
      />

      {/* Gold accent in the corner */}
      <motion.div
        className="fixed top-[10%] left-[5%] w-48 h-48 rounded-full bg-[#D4AF37]/5 blur-3xl z-0"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          repeatDelay: 1,
        }}
      />
    </>
  )
}

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  isGold: boolean
  update: () => void
  draw: () => void
}
