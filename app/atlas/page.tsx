import type { Metadata } from 'next'
import { AtlasTimeline } from '../../components/atlas/AtlasTimeline'

export const metadata: Metadata = {
  title: 'Atlas',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
}

export default function AtlasPage() {
  return <AtlasTimeline />
}
