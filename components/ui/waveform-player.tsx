"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WaveformPlayerProps { audioSrc: string; width?: number; height?: number; className?: string }

export default function WaveformPlayer({ audioSrc, width = 400, height = 60, className }: WaveformPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const contextRef = React.useRef<AudioContext | null>(null)
  const sourceRef = React.useRef<MediaElementAudioSourceNode | null>(null)
  const analyserRef = React.useRef<AnalyserNode | null>(null)
  const frameRef = React.useRef<number | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [spectrum, setSpectrum] = React.useState<number[]>(() => Array.from({ length: 40 }, () => 0.08))

  React.useEffect(() => {
    const audio = new Audio(audioSrc)
    audio.preload = "metadata"
    audioRef.current = audio
    const handleTimeUpdate = () => setProgress(audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0)
    const handleEnded = () => { setIsPlaying(false); setProgress(0); setSpectrum(Array.from({ length: 40 }, () => 0.08)); if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); frameRef.current = null }
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.pause()
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      sourceRef.current?.disconnect(); analyserRef.current?.disconnect(); void contextRef.current?.close()
      audioRef.current = null; contextRef.current = null; sourceRef.current = null; analyserRef.current = null
    }
  }, [audioSrc])

  const ensureAnalyser = React.useCallback(() => {
    const audio = audioRef.current
    if (!audio) return null
    if (!contextRef.current) {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioContextClass) return null
      const context = new AudioContextClass()
      const source = context.createMediaElementSource(audio)
      const analyser = context.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.82
      source.connect(analyser); analyser.connect(context.destination)
      contextRef.current = context; sourceRef.current = source; analyserRef.current = analyser
    }
    return contextRef.current
  }, [])

  const updateSpectrum = React.useCallback(() => {
    const analyser = analyserRef.current
    if (!analyser) return
    const data = new Uint8Array(analyser.frequencyBinCount)
    const tick = () => {
      analyser.getByteFrequencyData(data)
      const binsPerBar = Math.max(1, Math.floor(data.length / 40))
      setSpectrum(Array.from({ length: 40 }, (_, index) => {
        const start = index * binsPerBar
        const end = Math.min(data.length, start + binsPerBar)
        let total = 0
        for (let i = start; i < end; i += 1) total += data[i]
        const average = end > start ? total / (end - start) : 0
        return Math.max(0.08, Math.min(1, Math.pow(average / 255, 0.62) * 1.15))
      }))
      frameRef.current = requestAnimationFrame(tick)
    }
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(tick)
  }, [])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) { audio.pause(); setIsPlaying(false); if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); frameRef.current = null; return }
    try { const context = ensureAnalyser(); if (context?.state === "suspended") await context.resume(); await audio.play(); setIsPlaying(true); updateSpectrum() } catch { setIsPlaying(false) }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width)
    audio.currentTime = (clickX / rect.width) * audio.duration
  }

  return (
    <div className={cn("flex flex-col items-center gap-2 w-full min-w-0", className)}>
      <div className="relative w-full max-w-full rounded-md cursor-pointer overflow-hidden" style={{ width, height, maxWidth: "100%" }} onClick={handleSeek}>
        <div className="absolute inset-0 flex justify-between items-center px-0.5">
          {spectrum.map((level, idx) => <div key={idx} className="rounded-sm bg-[var(--wave-color)]" style={{ width: 2, height: Math.max(4, level * (height - 10)), opacity: isPlaying ? 0.92 : 0.55, transition: "height 55ms linear, opacity 120ms ease" }} />)}
        </div>
        <div className="absolute top-0 left-0 h-full rounded-md overflow-hidden pointer-events-none" style={{ width: progress + "%" }}>
          <div className="absolute inset-0 flex justify-between items-center px-0.5">
            {spectrum.map((level, idx) => <div key={idx} className="rounded-sm bg-[var(--progress-color)]" style={{ width: 2, height: Math.max(4, level * (height - 10)), transition: "height 55ms linear" }} />)}
          </div>
        </div>
      </div>
      <Button onClick={togglePlay} className="w-20 text-sm px-2 py-1" variant="outline">{isPlaying ? "Pause" : "Play"}</Button>
    </div>
  )
}