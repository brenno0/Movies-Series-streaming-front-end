import { MediaPlayer, MediaProvider, Track } from '@vidstack/react'
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default'
import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/video.css'
import { Languages } from 'lucide-react'

const API_URL = 'http://localhost:3333'

interface VideoPlayerProps {
  src: string
  movieId: string
  lang?: 'pt' | 'en'
  onLangChange?: (lang: 'pt' | 'en') => void
}

export function VideoPlayer({ src, movieId, lang = 'pt', onLangChange }: Readonly<VideoPlayerProps>) {
  return (
    <div className="relative w-full bg-black" style={{ height: '90vh' }}>
      <MediaPlayer
        src={{ src, type: 'video/mp4' }}
        crossOrigin="anonymous"
        playsInline
        style={{ width: '100%', height: '100%' }}
      >
        <MediaProvider>
          <Track
            src={`${API_URL}/stream/subtitles/${movieId}?lang=pt`}
            kind="subtitles"
            label="Português (BR)"
            language="pt"
          />
          <Track
            src={`${API_URL}/stream/subtitles/${movieId}?lang=en`}
            kind="subtitles"
            label="English"
            language="en"
          />
        </MediaProvider>

        <DefaultVideoLayout
          icons={defaultLayoutIcons}
          slots={{
            settingsMenuEndItems: onLangChange ? (
              <div className="flex items-center justify-between px-3 py-2 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Languages className="size-4" />
                  <span>Dublagem</span>
                </div>
                <button
                  type="button"
                  onClick={() => onLangChange(lang === 'pt' ? 'en' : 'pt')}
                  className="text-xs px-2 py-1 border border-white/20 rounded text-white/80 hover:text-white hover:border-white/50 transition-colors"
                >
                  {lang === 'pt' ? '🇧🇷 PT-BR' : '🇺🇸 EN'}
                </button>
              </div>
            ) : null,
          }}
        />
      </MediaPlayer>
    </div>
  )
}
