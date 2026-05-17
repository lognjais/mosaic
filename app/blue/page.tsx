import type { Metadata } from 'next'
import { BlueTimeline } from '../../components/blue/BlueTimeline'

export const metadata: Metadata = {
  title: 'Blue',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export default function BluePage() {
  return <BlueTimeline />
}
