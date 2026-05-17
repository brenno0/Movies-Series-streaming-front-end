import {
  Link,
  Outlet,
  createRootRouteWithContext,
  redirect,
} from '@tanstack/react-router'

import type { QueryClient } from '@tanstack/react-query'
import Cookie from 'js-cookie'
import { NavigationMenuComponent } from '@/components/TopNav/index.tsx'
import { TopNavItems } from '@/constants/TopNav/items.ts'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { QueryParamInput } from '@/components/QueryParamInput'
import { Github, Twitter, Instagram, Youtube } from 'lucide-react'

interface MyRouterContext {
  queryClient: QueryClient
}

const RED = 'oklch(62% 0.18 195)'
const SURFACE = 'oklch(11% 0 0)'

function Footer() {
  return (
    <footer style={{ backgroundColor: SURFACE }} className="border-t border-white/[0.06] mt-8">
      <div className="px-8 md:px-12 py-14">
        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/home">
              <p className="logo text-4xl tracking-widest select-none" style={{ color: RED }}>
                NBFLIX
              </p>
            </Link>
            <p className="text-white/35 text-xs leading-relaxed mt-3 max-w-48">
              O melhor do cinema e das séries, em um só lugar. Assista quando e onde quiser.
            </p>
            {/* Socials */}
            <div className="flex gap-3 mt-5">
              {[
                { icon: Github, label: 'GitHub' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Youtube, label: 'YouTube' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-white/30 hover:text-white transition-colors cursor-pointer"
                  style={{ backgroundColor: 'oklch(16% 0 0)' }}
                >
                  <Icon className="size-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Navegar */}
          <div>
            <p className="section-label mb-4" style={{ color: RED }}>Navegar</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Início', href: '/home' },
                { label: 'Filmes', href: '/movies' },
                { label: 'Séries', href: '/series' },
                { label: 'Em Alta', href: '/home' },
                { label: 'Minha Lista', href: '/home' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href as any}
                    className="text-white/40 text-sm hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Gêneros */}
          <div>
            <p className="section-label mb-4" style={{ color: RED }}>Gêneros</p>
            <ul className="space-y-2.5">
              {[
                { label: 'Ação', href: '/genre?genreId=28&genreName=Ação&type=movie' },
                { label: 'Comédia', href: '/genre?genreId=35&genreName=Comédia&type=movie' },
                { label: 'Drama', href: '/genre?genreId=18&genreName=Drama&type=movie' },
                { label: 'Terror', href: '/genre?genreId=27&genreName=Terror&type=movie' },
                { label: 'Sci-Fi', href: '/genre?genreId=878&genreName=Sci-Fi&type=movie' },
                { label: 'Animação', href: '/genre?genreId=16&genreName=Animação&type=movie' },
                { label: 'Documentários', href: '/genre?genreId=99&genreName=Documentários&type=movie' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href as any}
                    className="text-white/40 text-sm hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <p className="section-label mb-4" style={{ color: RED }}>Suporte</p>
            <ul className="space-y-2.5">
              {[
                'Central de Ajuda',
                'Fale Conosco',
                'Termos de Uso',
                'Privacidade',
                'Cookies',
              ].map((label) => (
                <li key={label}>
                  <span className="text-white/40 text-sm hover:text-white transition-colors cursor-pointer">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Aplicativos */}
          <div>
            <p className="section-label mb-4" style={{ color: RED }}>Aplicativos</p>
            <ul className="space-y-2.5">
              {['Android', 'iOS', 'Smart TV', 'Web'].map((label) => (
                <li key={label}>
                  <span className="text-white/40 text-sm hover:text-white transition-colors cursor-pointer">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06] pt-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} NBFLIX. Todos os direitos reservados.
          </p>
          <p className="text-white/15 text-xs">
            Dados fornecidos por{' '}
            <span className="text-white/30">The Movie Database (TMDB)</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: ({ location }) => {
    const token = Cookie.get('access_token')
    const isAuthPage = location.pathname.startsWith('/auth/')

    if (!token && !isAuthPage) {
      throw redirect({ to: '/auth/sign-in' })
    }

    if (token && isAuthPage) {
      throw redirect({ to: '/home' })
    }
  },
  component: () => (
    <NuqsAdapter>
      <header className="fixed top-0 left-0 right-0 z-[999] w-full" style={{ background: 'linear-gradient(to bottom, oklch(8% 0 0 / 0.95) 0%, oklch(8% 0 0 / 0.7) 70%, transparent 100%)' }}>
        <div className="flex px-8 md:px-12 justify-between items-center w-full h-16">
          <Link to="/home" className="flex items-center">
            <p className="logo text-3xl tracking-widest select-none" style={{ color: RED }}>NBFLIX</p>
          </Link>
          <NavigationMenuComponent items={TopNavItems} />
          <div>
            <form>
              <QueryParamInput className="max-w-64 h-8 text-sm rounded-md" />
            </form>
          </div>
        </div>
      </header>
      <div className="h-16" />
      <Outlet />
      <Footer />
    </NuqsAdapter>
  ),
})
