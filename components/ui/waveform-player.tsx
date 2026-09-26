"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface WaveformPlayerProps {
  audioSrc: string
  width?: number
  height?: number
  className?: string
}

export default function WaveformPlayer({ audioSrc, width = 400, height = 60, className }: WaveformPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const bars = React.useMemo(() => Array.from({ length: 40 }, (_, index) => 20 + ((index * 17) % 36)), [])

  React.useEffect(() => {
    const audio = new Audio(audioSrc)
    audio.preload = "metadata"
    audioRef.current = audio
    const handleTimeUpdate = () => setProgress(audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0)
    const handleEnded = () => { setIsPlaying(false); setProgress(0) }
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    return () => {
      audio.pause()
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audioRef.current = null
    }
  }, [audioSrc])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      try { await audio.play(); setIsPlaying(true) } catch { setIsPlaying(false) }
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return
    const rect = event.currentTarget.getBoundingClientRect()
    const clickX = Math.min(Math.max(event.clientX - rect.left, 0), rect.width)
    audio.currentTime = (clickX / rect.width) * audio.duration
  }

  return (
    <div className={cn("waveform-player", className)} style={{ "--wave-height": `${height}px`, "--wave-width": `${width}px` } as React.CSSProperties}>
      <div className="waveform-player-track" onClick={handleSeek} role="slider" aria-label="Posisi musik" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} tabIndex={0}>
        <div className="waveform-player-bars" aria-hidden="true">
          {bars.map((bar, index) => <span key={index} style={{ height: `${bar}%` }} />)}
        </div>
        <div className="waveform-player-progress" style={{ width: `${progress}%` }} aria-hidden="true">
          <div className="waveform-player-bars">
            {bars.map((bar, index) => <span key={index} style={{ height: `${bar}%` }} />)}
          </div>
        </div>
      </div>
      <Button type="button" className="waveform-player-button" onClick={togglePlay} aria-label={isPlaying ? "Pause musik" : "Putar musik"}>
        {isPlaying ? "Pause" : "Play"}
      </Button>
    </div>
  )
}
