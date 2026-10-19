'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { clamp } from '@/lib/motion'

export function useVideoClock(duration: number) {
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(true)
  const timeRef = useRef(0)

  useEffect(() => {
    if (!playing) return
    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const delta = Math.min(0.1, (now - last) / 1000)
      last = now
      const next = Math.min(duration, timeRef.current + delta)
      timeRef.current = next
      setTime(next)
      if (next >= duration) {
        setPlaying(false)
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playing, duration])

  const seek = useCallback(
    (value: number) => {
      timeRef.current = clamp(value, 0, duration)
      setTime(timeRef.current)
    },
    [duration],
  )

  const toggle = useCallback(() => {
    if (timeRef.current >= duration) {
      seek(0)
      setPlaying(true)
      return
    }
    setPlaying((current) => !current)
  }, [duration, seek])

  const restart = useCallback(() => {
    seek(0)
    setPlaying(true)
  }, [seek])

  return { time, playing, setPlaying, seek, toggle, restart }
}
