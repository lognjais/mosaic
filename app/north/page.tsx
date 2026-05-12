import type { Metadata } from 'next'
import { NorthTimeline } from '../../components/north/NorthTimeline'

export const metadata: Metadata = {
  title: 'North',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export default function NorthPage() {
  return <NorthTimeline />
}
