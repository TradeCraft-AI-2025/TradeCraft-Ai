"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function BackgroundEffect() {
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
    const gridOpacity = 0.15

    // Particle parameters
    const particles: Particle[] = []
    const particleCount = 50
    const connectionDistance = 150
    const connectionOpacity = 0.15

    // Create particles
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = "#00FFFF"
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY
        }
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

      ctx.strokeStyle = "rgba(0, 255, 255, " + gridOpacity + ")"
      ctx.lineWidth = 0.3

      // Draw vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Draw horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    // Draw connections between particles
    function drawConnections() {
      if (!ctx) return

      ctx.strokeStyle = `rgba(0, 255, 255, ${connectionOpacity})`
      ctx.lineWidth = 0.3

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            const opacity = 1 - distance / connectionDistance
            ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * connectionOpacity})`
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Draw data visualization elements
    function drawDataElements() {
      if (!ctx) return

      // Draw a few random "data points" that change over time
      const time = Date.now() / 1000

      // Draw price chart line
      ctx.strokeStyle = "rgba(0, 255, 255, 0.4)"
      ctx.lineWidth = 1
      ctx.beginPath()

      const chartWidth = canvas.width * 0.3
      const chartHeight = canvas.height * 0.15
      const chartX = canvas.width * 0.05
      const chartY = canvas.height * 0.85

      ctx.moveTo(chartX, chartY)

      for (let i = 0; i <= 100; i++) {
        const x = chartX + (i / 100) * chartWidth
        const y = chartY - Math.sin(i * 0.1 + time) * 20 - Math.sin(i * 0.05 + time * 0.5) * 15
        ctx.lineTo(x, y)
      }

      ctx.stroke()

      // Draw some random "market data" numbers
      ctx.fillStyle = "rgba(0, 255, 255, 0.15)"
      ctx.font = "12px monospace"

      for (let i = 0; i < 10; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        const value = (Math.sin(x * 0.01 + time) * 100).toFixed(2)
        ctx.fillText(value, x, y)
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

      // Draw subtle data visualization elements
      drawDataElements()

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
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent to-black/30 z-0" />

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
        className="fixed bottom-[30%] left-[15%] w-64 h-64 rounded-full bg-blue-500/5 blur-3xl z-0"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </>
  )
}
