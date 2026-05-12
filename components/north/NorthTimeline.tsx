'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BEDROCK_DOMAINS,
  HALFLIFE_LABEL,
  LIVING_LAYER,
  PATH,
  RESOURCE_KIND_LABEL,
  STREAM_LABELS,
  allTasks,
  maxGlobalWeek,
  periodAtGlobalWeek,
  periodLabel,
  periodSpan,
  totalGlobalWeeks,
  type HalfLife,
  type Phase,
  type Resource,
  type Stream,
  type Task,
  type Track,
  type Week,
} from '../../lib/north-plan'
import { useNorthProgress } from '../../lib/use-north-progress'

const TRACKS: Track[] = ['read', 'build', 'apply', 'prep']
const TRACK_LABEL: Record<Track, string> = {
  read: 'Read',
  build: 'Build',
  apply: 'Apply',
  prep: 'Prep',
}
const TRACK_ACCENT: Record<Track, string> = {
  read: 'var(--m-track-architecture)',
  build: 'var(--m-track-execution)',
  apply: 'var(--m-track-foundations)',
  prep: 'var(--m-track-compilers)',
}

const STREAM_FILTERS: ('all' | Stream)[] = ['all', 'systems', 'research']
const TOTAL_GLOBAL_WEEKS = totalGlobalWeeks()
const MAX_GLOBAL_WEEK = maxGlobalWeek()

type Row = {
  g: number
  panelId: number
  phase: Phase
  week: Week
  isPeriodStart: boolean
  isPhaseStart: boolean
  weekInPeriod: number
  periodWeeks: number
  periodIndexInPhase: number
}

function buildRows(): Row[] {
  const out: Row[] = []
  for (let g = 0; g <= MAX_GLOBAL_WEEK; g++) {
    const ctx = periodAtGlobalWeek(g)
    if (!ctx) continue
    const [start, end] = periodSpan(ctx.week.number)
    const isPeriodStart = g === start
    const isPhaseStart =
      isPeriodStart && ctx.phase.weeks[0].number === ctx.week.number
    const periodIdx = ctx.phase.weeks.findIndex((w) => w.number === ctx.week.number)
    out.push({
      g,
      panelId: ctx.week.number,
      phase: ctx.phase,
      week: ctx.week,
      isPeriodStart,
      isPhaseStart,
      weekInPeriod: g - start + 1,
      periodWeeks: end - start + 1,
      periodIndexInPhase: periodIdx,
    })
  }
  return out
}

function pct(part: number, whole: number): number {
  return whole === 0 ? 0 : Math.round((part / whole) * 100)
}

export function NorthTimeline() {
  const {
    state,
    isDone,
    getNote,
    toggle,
    setNote,
    setCurrentGlobalWeek,
    reset,
    exportJson,
    importJson,
  } = useNorthProgress()

  const rows = useMemo(buildRows, [])
  const all = useMemo(() => allTasks(), [])
  const totalDone = all.filter((t) => isDone(t.id)).length
  const total = all.length
  const overallPct = pct(totalDone, total)

  const initialG = state.currentGlobalWeek ?? 0
  const [expanded, setExpanded] = useState<number | null>(initialG)
  const [visibleG, setVisibleG] = useState<number>(initialG)
  const [bedrockOpen, setBedrockOpen] = useState(false)

  const rowRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .map((e) => Number((e.target as HTMLElement).dataset.week))
          .filter((n) => Number.isFinite(n))
        if (intersecting.length === 0) return
        const top = Math.min(...intersecting)
        setVisibleG((prev) => (prev === top ? prev : top))
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
    )
    rowRefs.current.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [rows.length])

  useEffect(() => {
    if (visibleG === state.currentGlobalWeek) return
    const id = requestAnimationFrame(() => {
      const ctx = periodAtGlobalWeek(visibleG)
      if (ctx) setCurrentGlobalWeek(visibleG, ctx.week.number)
    })
    return () => cancelAnimationFrame(id)
  }, [visibleG]) // eslint-disable-line react-hooks/exhaustive-deps

  const didMountScroll = useRef(false)
  useEffect(() => {
    if (didMountScroll.current) return
    if (initialG === 0) {
      didMountScroll.current = true
      return
    }
    const el = rowRefs.current.get(initialG)
    if (el) {
      el.scrollIntoView({ behavior: 'auto', block: 'center' })
      didMountScroll.current = true
    }
  }, [initialG, rows.length])

  const scrollToWeek = useCallback((g: number) => {
    const el = rowRefs.current.get(g)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  const toggleExpand = useCallback((g: number) => {
    setExpanded((prev) => (prev === g ? null : g))
  }, [])

  const expandAndScroll = useCallback(
    (g: number) => {
      setExpanded(g)
      requestAnimationFrame(() => scrollToWeek(g))
    },
    [scrollToWeek],
  )

  const visibleCtx = periodAtGlobalWeek(visibleG)

  return (
    <div className="m-atlas m-atlas-tl-layout">
      <div className="m-atlas-tl-main">
        <header className="m-atlas-header">
          <div className="m-atlas-title-row">
            <h1 className="m-atlas-title">North</h1>
            <span className="m-atlas-sub">private · 13-week hire sprint · the 90-day route</span>
          </div>
          <div className="m-atlas-stats">
            <span className="m-atlas-stat">
              <strong>W{visibleG}</strong> / W{MAX_GLOBAL_WEEK}
            </span>
            <span className="m-atlas-stat-sep">·</span>
            <span className="m-atlas-stat">
              <strong>{totalDone}</strong> / {total} tasks
            </span>
            <span className="m-atlas-stat-sep">·</span>
            {visibleCtx && (
              <span
                className="m-atlas-stat m-atlas-stat-phase"
                style={{ '--phase-color': visibleCtx.phase.color } as React.CSSProperties}
              >
                {visibleCtx.phase.title.replace('Phase ', 'P')}
              </span>
            )}
            <span className="m-atlas-stat-sep">·</span>
            <span className="m-atlas-stat">{overallPct}%</span>
          </div>

          <BedrockDisclosure
            open={bedrockOpen}
            onToggle={() => setBedrockOpen((x) => !x)}
          />
        </header>

        <div className="m-atlas-tl">
          {rows.map((row) => (
            <TimelineRow
              key={row.g}
              row={row}
              expanded={expanded === row.g}
              onToggle={() => toggleExpand(row.g)}
              onPrev={row.g > 0 ? () => expandAndScroll(row.g - 1) : undefined}
              onNext={row.g < MAX_GLOBAL_WEEK ? () => expandAndScroll(row.g + 1) : undefined}
              isDone={isDone}
              getNote={getNote}
              toggle={toggle}
              setNote={setNote}
              registerRef={(el) => {
                if (el) rowRefs.current.set(row.g, el)
                else rowRefs.current.delete(row.g)
              }}
            />
          ))}
        </div>

        <footer className="m-atlas-footer">
          <button
            className="m-atlas-link"
            type="button"
            onClick={() => {
              const blob = new Blob([exportJson()], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              const date = new Date().toISOString().slice(0, 10)
              a.download = `north-progress-${date}.json`
              document.body.appendChild(a)
              a.click()
              a.remove()
              URL.revokeObjectURL(url)
            }}
          >
            Export
          </button>
          <span className="m-atlas-footer-sep">·</span>
          <label className="m-atlas-link" htmlFor="north-import">
            Import
            <input
              id="north-import"
              type="file"
              accept="application/json"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (!f) return
                const text = await f.text()
                const ok = importJson(text)
                if (!ok) alert('Import failed — invalid JSON')
                e.target.value = ''
              }}
            />
          </label>
          <span className="m-atlas-footer-sep">·</span>
          <button
            className="m-atlas-link"
            type="button"
            onClick={() => setExpanded(null)}
            title="Close the open week"
            disabled={expanded === null}
          >
            Close
          </button>
          <span className="m-atlas-footer-sep">·</span>
          <span className="m-atlas-stat">
            {TOTAL_GLOBAL_WEEKS} weeks · {PATH.length} phases
          </span>
          <span className="m-atlas-footer-sep">·</span>
          <button
            className="m-atlas-link m-atlas-link-danger"
            type="button"
            onClick={() => {
              if (confirm('Wipe all north progress? This cannot be undone.')) reset()
            }}
          >
            Reset
          </button>
        </footer>
      </div>

      <Minimap rows={rows} currentG={visibleG} onJump={(g) => expandAndScroll(g)} />
    </div>
  )
}

export const North = NorthTimeline

// ────────────────────────────────────────────────────────────────────────
// Bedrock disclosure — shared with Atlas conceptually, rendered separately
// here so North's header stays self-contained.
// ────────────────────────────────────────────────────────────────────────

function BedrockDisclosure({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div className={'m-atlas-bedrock' + (open ? ' m-atlas-bedrock-open' : '')}>
      <button
        type="button"
        className="m-atlas-bedrock-toggle"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="m-atlas-bedrock-tag">Bedrock</span>
        <span className="m-atlas-bedrock-summary">
          {BEDROCK_DOMAINS.length} immutable foundations · the spine North trusts
        </span>
        <span className="m-atlas-bedrock-chev">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="m-atlas-bedrock-body">
          <p className="m-atlas-bedrock-intro">
            North is the sprint. Atlas is the spine. These twelve domains are what stays true
            after every framework rotates. North trusts that Atlas covers them — but if you
            hit a wall during the sprint, re-anchor here.
          </p>
          <ol className="m-atlas-bedrock-list">
            {BEDROCK_DOMAINS.map((d) => (
              <li key={d.title} className="m-atlas-bedrock-item">
                <div className="m-atlas-bedrock-item-title">{d.title}</div>
                <div className="m-atlas-bedrock-item-why">{d.why}</div>
                {d.anchors.length > 0 && (
                  <div className="m-atlas-bedrock-item-anchors">
                    {d.anchors.map((a, i) => (
                      <span key={a + i} className="m-atlas-bedrock-anchor">
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ol>
          <div className="m-atlas-bedrock-footer">
            <div className="m-atlas-bedrock-living">
              <strong>Living layer</strong> — channels that stay current by being read, not by edits.
              30 min/wk skim during the sprint.
            </div>
            <ul className="m-atlas-bedrock-living-list">
              {LIVING_LAYER.map((r) => (
                <li key={r.url}>
                  <a
                    className="m-atlas-bedrock-living-link"
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {r.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────
// Timeline row
// ────────────────────────────────────────────────────────────────────────

function TimelineRow({
  row,
  expanded,
  onToggle,
  onPrev,
  onNext,
  isDone,
  getNote,
  toggle,
  setNote,
  registerRef,
}: {
  row: Row
  expanded: boolean
  onToggle: () => void
  onPrev?: () => void
  onNext?: () => void
  isDone: (id: string) => boolean
  getNote: (id: string) => string
  toggle: (id: string) => void
  setNote: (id: string, note: string) => void
  registerRef: (el: HTMLDivElement | null) => void
}) {
  const { g, phase, week, isPeriodStart, isPhaseStart, weekInPeriod, periodWeeks } = row
  const periodTasks = week.tasks
  const periodDone = periodTasks.filter((t) => isDone(t.id)).length
  const isPanelComplete = periodTasks.length > 0 && periodDone === periodTasks.length
  const periodPct = pct(periodDone, periodTasks.length)

  const phaseShort = phase.title.replace('Phase ', 'P').replace(/ — .*/, '')
  const phaseTail = phase.title.replace(/^Phase \d+ — /, '')

  return (
    <div
      ref={registerRef}
      className={
        'm-atlas-tl-row' +
        (expanded ? ' m-atlas-tl-row-open' : '') +
        (isPhaseStart ? ' m-atlas-tl-row-phase-start' : '')
      }
      data-week={g}
      data-phase={phase.id}
      style={{ '--phase-color': phase.color } as React.CSSProperties}
    >
      {isPhaseStart && (
        <div className="m-atlas-tl-phase-divider">
          <span className="m-atlas-tl-phase-divider-tag">{phase.title}</span>
        </div>
      )}
      <button
        type="button"
        className={
          'm-atlas-tl-node' +
          (isPanelComplete ? ' m-atlas-tl-node-done' : '') +
          (expanded ? ' m-atlas-tl-node-open' : '')
        }
        onClick={onToggle}
        aria-expanded={expanded}
        aria-label={`Week ${g} — ${phase.title} — ${week.title}`}
      >
        <span className="m-atlas-tl-dot" aria-hidden="true" />
        <span className="m-atlas-tl-w">W{g}</span>
        <span className="m-atlas-tl-phase-tag">{phaseShort}</span>
        <span className="m-atlas-tl-phase-title">{phaseTail}</span>
        {phase.cadence === 'quarter' && (
          <span className="m-atlas-tl-period-tag">
            Y{phase.year}·Q{row.periodIndexInPhase + 1}
            <span className="m-atlas-tl-period-progress">
              {' '}· {weekInPeriod}/{periodWeeks}
            </span>
          </span>
        )}
        {isPeriodStart && periodTasks.length > 0 && (
          <span className="m-atlas-tl-progress" title={`${periodDone}/${periodTasks.length}`}>
            <span className="m-atlas-tl-progress-fill" style={{ width: `${periodPct}%` }} />
          </span>
        )}
        <span className="m-atlas-tl-chev" aria-hidden="true">
          {expanded ? '−' : '+'}
        </span>
      </button>

      {expanded && (
        <div className="m-atlas-tl-panel">
          <ExpandedWeekPanel
            phase={phase}
            week={week}
            row={row}
            isDone={isDone}
            getNote={getNote}
            toggle={toggle}
            setNote={setNote}
            onPrev={onPrev}
            onNext={onNext}
          />
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────
// Expanded panel
// ────────────────────────────────────────────────────────────────────────

function ExpandedWeekPanel({
  phase,
  week,
  row,
  isDone,
  getNote,
  toggle,
  setNote,
  onPrev,
  onNext,
}: {
  phase: Phase
  week: Week
  row: Row
  isDone: (id: string) => boolean
  getNote: (id: string) => string
  toggle: (id: string) => void
  setNote: (id: string, note: string) => void
  onPrev?: () => void
  onNext?: () => void
}) {
  const showStreamFilter = phase.cadence === 'quarter'
  const [stream, setStream] = useState<'all' | Stream>('all')

  const filtered = useMemo(() => {
    if (!showStreamFilter || stream === 'all') return week.tasks
    return week.tasks.filter(
      (t) => (t.stream ?? 'core') === stream || (t.stream ?? 'core') === 'core',
    )
  }, [week.tasks, stream, showStreamFilter])

  const counts = useMemo<Record<'all' | Stream, number>>(() => {
    return {
      all: week.tasks.length,
      core: week.tasks.filter((t) => (t.stream ?? 'core') === 'core').length,
      systems: week.tasks.filter((t) => (t.stream ?? 'core') === 'systems').length,
      research: week.tasks.filter((t) => (t.stream ?? 'core') === 'research').length,
    }
  }, [week.tasks])

  const periodLbl = periodLabel(phase, week)
  const weekDone = week.tasks.filter((t) => isDone(t.id)).length
  const positional =
    phase.cadence === 'quarter'
      ? `Week ${row.weekInPeriod} of ${row.periodWeeks} in ${periodLbl} — same playbook for ${row.periodWeeks} weeks.`
      : null

  return (
    <div className="m-atlas-week" style={{ '--phase-color': phase.color } as React.CSSProperties}>
      <div className="m-atlas-week-head">
        <div className="m-atlas-week-meta">
          <span className="m-atlas-week-phase-tag">{phase.title}</span>
          {phase.artifact && (
            <span className="m-atlas-week-meta-artifact"> · artifact: {phase.artifact}</span>
          )}
        </div>
        <h2 className="m-atlas-week-title">
          <span className="m-atlas-week-num">W{row.g}</span>
          <span className="m-atlas-week-num-secondary">{periodLbl}</span>
          <span>{week.title}</span>
        </h2>
        <p className="m-atlas-week-goal">{week.goal}</p>
        {positional && <p className="m-atlas-week-positional">{positional}</p>}
        {phase.context && <p className="m-atlas-week-blurb">{phase.context}</p>}
        <div className="m-atlas-week-progress">
          <div
            className="m-atlas-week-progress-fill"
            style={{ width: `${pct(weekDone, week.tasks.length)}%` }}
          />
        </div>
        <div className="m-atlas-week-progress-meta">
          {weekDone} / {week.tasks.length} done · {phase.cadence}
        </div>
      </div>

      {showStreamFilter && (
        <StreamFilter stream={stream} onChange={setStream} counts={counts} />
      )}

      <div className="m-atlas-cols">
        {TRACKS.map((track) => {
          const tasksInTrack = filtered.filter((t) => t.track === track)
          if (tasksInTrack.length === 0) {
            return (
              <div key={track} className="m-atlas-col m-atlas-col-empty">
                <div
                  className="m-atlas-col-head"
                  style={{ '--track-accent': TRACK_ACCENT[track] } as React.CSSProperties}
                >
                  <span className="m-atlas-col-label">{TRACK_LABEL[track]}</span>
                  <span className="m-atlas-col-count">—</span>
                </div>
                <div className="m-atlas-col-empty-msg">nothing this {phase.cadence}</div>
              </div>
            )
          }
          const doneInTrack = tasksInTrack.filter((t) => isDone(t.id)).length
          return (
            <div key={track} className="m-atlas-col">
              <div
                className="m-atlas-col-head"
                style={{ '--track-accent': TRACK_ACCENT[track] } as React.CSSProperties}
              >
                <span className="m-atlas-col-label">{TRACK_LABEL[track]}</span>
                <span className="m-atlas-col-count">
                  {doneInTrack}/{tasksInTrack.length}
                </span>
              </div>
              <div className="m-atlas-col-body">
                {tasksInTrack.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    done={isDone(task.id)}
                    note={getNote(task.id)}
                    onToggle={() => toggle(task.id)}
                    onNoteChange={(n) => setNote(task.id, n)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {week.reading && week.reading.length > 0 && (
        <ReadingList resources={week.reading} cadence={phase.cadence} />
      )}

      <div className="m-atlas-week-nav">
        <button type="button" className="m-atlas-nav-btn" onClick={onPrev} disabled={!onPrev}>
          ← W{row.g - 1}
        </button>
        <button type="button" className="m-atlas-nav-btn" onClick={onNext} disabled={!onNext}>
          W{row.g + 1} →
        </button>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────────────────
// Sticky vertical mini-map
// ────────────────────────────────────────────────────────────────────────

function Minimap({
  rows,
  currentG,
  onJump,
}: {
  rows: Row[]
  currentG: number
  onJump: (g: number) => void
}) {
  return (
    <aside className="m-atlas-mini" role="navigation" aria-label="Mini-map of the North sprint">
      <div className="m-atlas-mini-rail">
        {rows.map((r) => {
          const isCurrent = r.g === currentG
          return (
            <button
              key={r.g}
              type="button"
              className={
                'm-atlas-mini-cell' +
                (isCurrent ? ' m-atlas-mini-cell-current' : '') +
                (r.isPhaseStart ? ' m-atlas-mini-cell-phase-start' : '')
              }
              style={{ '--phase-color': r.phase.color } as React.CSSProperties}
              onClick={() => onJump(r.g)}
              title={`W${r.g} · ${r.phase.title} · ${r.week.title}`}
              aria-label={`Jump to W${r.g} — ${r.phase.title}`}
            />
          )
        })}
      </div>
    </aside>
  )
}

// ────────────────────────────────────────────────────────────────────────
// Stream filter / Reading list / Task card
// ────────────────────────────────────────────────────────────────────────

function StreamFilter({
  stream,
  onChange,
  counts,
}: {
  stream: 'all' | Stream
  onChange: (s: 'all' | Stream) => void
  counts: Record<'all' | Stream, number>
}) {
  return (
    <div className="m-atlas-stream-tabs" role="tablist" aria-label="Stream filter">
      {STREAM_FILTERS.map((s) => (
        <button
          key={s}
          type="button"
          role="tab"
          aria-selected={stream === s}
          className={'m-atlas-stream-tab' + (stream === s ? ' m-atlas-stream-tab-active' : '')}
          onClick={() => onChange(s)}
        >
          {s === 'all' ? 'All' : STREAM_LABELS[s]}
          <span className="m-atlas-stream-tab-count">{counts[s]}</span>
        </button>
      ))}
    </div>
  )
}

function ReadingList({ resources, cadence }: { resources: Resource[]; cadence: 'week' | 'quarter' }) {
  return (
    <aside className="m-atlas-reading">
      <div className="m-atlas-reading-head">
        Further reading this {cadence}{' '}
        <span className="m-atlas-reading-count">{resources.length}</span>
      </div>
      <ul className="m-atlas-reading-list">
        {resources.map((r) => (
          <li key={r.url} className="m-atlas-reading-item">
            <ResourceRow resource={r} />
          </li>
        ))}
      </ul>
    </aside>
  )
}

function HalfLifeBadge({ halfLife }: { halfLife?: HalfLife }) {
  if (!halfLife || halfLife === 'medium') return null
  return (
    <span className={`m-atlas-halflife m-atlas-halflife-${halfLife}`} title={`half-life: ${halfLife}`}>
      {halfLife === 'durable' ? '∞ durable' : '⌛ ' + HALFLIFE_LABEL[halfLife]}
    </span>
  )
}

function ResourceRow({ resource }: { resource: Resource }) {
  const isInternal = resource.kind === 'mosaic' || resource.url.startsWith('/')
  return (
    <a
      href={resource.url}
      className="m-atlas-resource"
      target={isInternal ? undefined : '_blank'}
      rel={isInternal ? undefined : 'noopener noreferrer'}
    >
      <span className={`m-atlas-resource-kind m-atlas-resource-kind-${resource.kind}`}>
        {RESOURCE_KIND_LABEL[resource.kind]}
      </span>
      <span className="m-atlas-resource-main">
        <span className="m-atlas-resource-title">
          {resource.title}
          <HalfLifeBadge halfLife={resource.halfLife} />
        </span>
        {resource.why && <span className="m-atlas-resource-why">{resource.why}</span>}
      </span>
      {resource.hours && <span className="m-atlas-resource-hours">{resource.hours}</span>}
    </a>
  )
}

function TaskCard({
  task,
  done,
  note,
  onToggle,
  onNoteChange,
}: {
  task: Task
  done: boolean
  note: string
  onToggle: () => void
  onNoteChange: (n: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(note)
  const stream = task.stream ?? 'core'

  return (
    <div
      className={
        'm-atlas-task' +
        (done ? ' m-atlas-task-done' : '') +
        (stream !== 'core' ? ` m-atlas-task-stream-${stream}` : '')
      }
    >
      <div className="m-atlas-task-row">
        <button
          type="button"
          className={'m-atlas-check' + (done ? ' m-atlas-check-done' : '')}
          onClick={onToggle}
          aria-label={done ? 'Mark not done' : 'Mark done'}
          aria-pressed={done}
        >
          {done ? '✓' : ''}
        </button>
        <button
          type="button"
          className="m-atlas-task-main"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <div className="m-atlas-task-title">
            {task.title}
            {stream !== 'core' && (
              <span className={`m-atlas-task-stream-tag m-atlas-task-stream-tag-${stream}`}>
                {STREAM_LABELS[stream]}
              </span>
            )}
          </div>
          <div className="m-atlas-task-meta">
            {task.hours && <span className="m-atlas-task-hours">{task.hours}</span>}
            {task.prereqs && task.prereqs.length > 0 && (
              <span className="m-atlas-task-prereq">↳ after {task.prereqs.join(', ')}</span>
            )}
            {task.resources && task.resources.length > 0 && (
              <span className="m-atlas-task-reslink">{task.resources.length} ref</span>
            )}
            <span className="m-atlas-task-id">{task.id}</span>
          </div>
        </button>
      </div>
      {open && (
        <div className="m-atlas-task-body">
          {task.body && <p className="m-atlas-task-desc">{task.body}</p>}
          <div className="m-atlas-task-verify">
            <span className="m-atlas-task-verify-label">Verify</span>
            <span className="m-atlas-task-verify-text">{task.verify}</span>
          </div>
          {task.resources && task.resources.length > 0 && (
            <div className="m-atlas-task-resources">
              <div className="m-atlas-task-resources-label">Resources</div>
              <ul className="m-atlas-task-resources-list">
                {task.resources.map((r) => (
                  <li key={r.url}>
                    <ResourceRow resource={r} />
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="m-atlas-task-note">
            <label className="m-atlas-task-note-label" htmlFor={`note-${task.id}`}>
              Notes (saved locally)
            </label>
            <textarea
              id={`note-${task.id}`}
              className="m-atlas-task-note-input"
              value={draft}
              placeholder="Numbers, links, what you learned, what surprised you…"
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => {
                if (draft !== note) onNoteChange(draft)
              }}
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  )
}
