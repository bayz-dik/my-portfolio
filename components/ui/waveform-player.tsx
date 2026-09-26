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

export default function WaveformPlayer({
  audioSrc,
  width = 400,
  height = 60,
  className,
}: WaveformPlayerProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const audio = new Audio(audioSrc)
    audio.preload = "metadata"
    audioRef.current = audio

    const handleTimeUpdate = () => {
      setProgress(audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.pause()
      audioRef.current = null
    }
  }, [audioSrc])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    void audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false))
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const audio = audioRef.current
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width)
    const seekTime = (clickX / rect.width) * audio.duration
    audio.currentTime = seekTime
  }

  return (
    <div className={cn("flex flex-col items-center gap-2 w-full min-w-0", className)}>
      <div
        className="relative w-full max-w-full rounded-md cursor-pointer overflow-hidden"
        style={{ width, height, maxWidth: "100%" }}
        onClick={handleSeek}
      >
        {/* Background wave */}
        <div className="absolute inset-0 flex justify-between items-center px-0.5">
          {Array.from({ length: 40 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-sm bg-black dark:bg-white"
              style={{
                width: 2,
                height: `${10 + ((idx * 37) % Math.max(1, height - 20))}px`,
              }}
            />
          ))}
        </div>

        {/* Progress overlay */}
        <div
          className="absolute top-0 left-0 h-full rounded-md bg-black dark:bg-white"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <Button
        onClick={togglePlay}
        className="w-20 text-sm px-2 py-1"
        variant="outline"
      >
        {isPlaying ? "Pause" : "Play"}
      </Button>
    </div>
  )
}
