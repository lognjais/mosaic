'use client'

import { useCallback, useEffect, useState } from 'react'
import { periodSpan } from './blue-plan'

const KEY = 'mosaic:blue:v1'
const EVENT = 'mosaic:blue-progress'

type BlueState = {
  done: Record<string, { at: string }>
  notes: Record<string, string>
  currentWeek: number
  currentGlobalWeek: number
  startDate?: string
}

const EMPTY: BlueState = { done: {}, notes: {}, currentWeek: 0, currentGlobalWeek: 0 }

function load(): BlueState {
  if (typeof window === 'undefined') return EMPTY
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw)
    const currentWeek = typeof parsed.currentWeek === 'number' ? parsed.currentWeek : 0
    let currentGlobalWeek: number
    if (typeof parsed.currentGlobalWeek === 'number') {
      currentGlobalWeek = parsed.currentGlobalWeek
    } else {
      currentGlobalWeek = periodSpan(currentWeek)[0]
    }
    return {
      done: parsed.done ?? {},
      notes: parsed.notes ?? {},
      currentWeek,
      currentGlobalWeek,
      startDate: typeof parsed.startDate === 'string' ? parsed.startDate : undefined,
    }
  } catch {
    return EMPTY
  }
}

function persist(s: BlueState) {
  localStorage.setItem(KEY, JSON.stringify(s))
  window.dispatchEvent(new Event(EVENT))
}

export function useBlueProgress() {
  const [state, setState] = useState<BlueState>(EMPTY)

  useEffect(() => {
    const sync = () => setState(load())
    sync()
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const toggle = useCallback((id: string) => {
    const next = load()
    if (next.done[id]) {
      delete next.done[id]
    } else {
      next.done[id] = { at: new Date().toISOString() }
    }
    persist(next)
    setState({ ...next })
  }, [])

  const setNote = useCallback((id: string, note: string) => {
    const next = load()
    if (note.trim().length === 0) {
      delete next.notes[id]
    } else {
      next.notes[id] = note
    }
    persist(next)
    setState({ ...next })
  }, [])

  const setCurrentWeek = useCallback((n: number) => {
    const next = load()
    next.currentWeek = n
    next.currentGlobalWeek = periodSpan(n)[0]
    persist(next)
    setState({ ...next })
  }, [])

  const setCurrentGlobalWeek = useCallback(
    (g: number, panelId?: number) => {
      const next = load()
      next.currentGlobalWeek = g
      if (typeof panelId === 'number') next.currentWeek = panelId
      persist(next)
      setState({ ...next })
    },
    [],
  )

  const setStartDate = useCallback((date: string | undefined) => {
    const next = load()
    if (date) next.startDate = date
    else delete next.startDate
    persist(next)
    setState({ ...next })
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem(KEY)
    window.dispatchEvent(new Event(EVENT))
    setState(EMPTY)
  }, [])

  const exportJson = useCallback(() => JSON.stringify(load(), null, 2), [])

  const importJson = useCallback((raw: string): boolean => {
    try {
      const parsed = JSON.parse(raw)
      if (typeof parsed !== 'object' || parsed === null) return false
      const currentWeek = typeof parsed.currentWeek === 'number' ? parsed.currentWeek : 0
      const currentGlobalWeek =
        typeof parsed.currentGlobalWeek === 'number'
          ? parsed.currentGlobalWeek
          : periodSpan(currentWeek)[0]
      const merged: BlueState = {
        done: parsed.done ?? {},
        notes: parsed.notes ?? {},
        currentWeek,
        currentGlobalWeek,
        startDate: typeof parsed.startDate === 'string' ? parsed.startDate : undefined,
      }
      persist(merged)
      setState(merged)
      return true
    } catch {
      return false
    }
  }, [])

  const isDone = useCallback((id: string) => Boolean(state.done[id]), [state])
  const getNote = useCallback((id: string) => state.notes[id] ?? '', [state])

  return {
    state,
    isDone,
    getNote,
    toggle,
    setNote,
    setCurrentWeek,
    setCurrentGlobalWeek,
    setStartDate,
    reset,
    exportJson,
    importJson,
  }
}
