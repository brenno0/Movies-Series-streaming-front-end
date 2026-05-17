import { VideoPlayer } from '@/components/VideoPlayer'

export function MovieModalContent({
  movieURL,
  movieTitle,
  movieId,
  isVideo = false,
  lang,
  onLangChange,
}: Readonly<{ movieURL: string; movieTitle: string; movieId?: string; isVideo?: boolean; lang?: 'pt' | 'en'; onLangChange?: (l: 'pt' | 'en') => void }>) {
  if (isVideo && movieId) {
    return <VideoPlayer src={movieURL} movieId={movieId} lang={lang} onLangChange={onLangChange} />
  }

  if (isVideo) {
    return (
      <video
        src={movieURL}
        controls
        autoPlay
        crossOrigin="anonymous"
        className="w-full bg-black"
        style={{ minHeight: '90vh' }}
      />
    )
  }

  return (
    <iframe
      title={movieTitle}
      className="w-full min-h-[90vh]"
      src={movieURL}
      allowFullScreen
    />
  )
}
