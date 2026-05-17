import { VideoPlayer } from '@/components/VideoPlayer'

export function SeriesModalContent({
  streamUrl,
  seriesId,
  lang,
  onLangChange,
}: Readonly<{ streamUrl: string; seriesTitle: string; seriesId: string; lang?: 'pt' | 'en'; onLangChange?: (l: 'pt' | 'en') => void }>) {
  return <VideoPlayer src={streamUrl} movieId={seriesId} lang={lang} onLangChange={onLangChange} />
}
