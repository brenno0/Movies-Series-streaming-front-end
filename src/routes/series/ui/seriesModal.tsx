import { useEffect } from 'react'

export function MovieModalContent({
  seriesUrl,
  movieTitle,
}: Readonly<{ seriesUrl: string; movieTitle: string }>) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // cheque a origem do iframe
      if (event.origin !== 'https://player-externo.com') return

      const data = event.data
      if (data.type === 'timeupdate') {
        console.log('Segundos assistidos:', data.currentTime)
        // Aqui você pode salvar no backend
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])
  return (
    <iframe
      title={movieTitle}
      className="w-full min-h-[90vh]"
      src={seriesUrl}
      allowFullScreen
    />
  )
}
