import type { ITopNavCategories } from "@/types";

export const TopNavItems: ITopNavCategories[] = [
  {
    categoryTitle: 'Início',
    categoryItems: [
      {
        href: '/home',
        title: 'Início',
        description: 'Página inicial',
        mainItem: true,
      },
    ],
  },
  {
    categoryTitle: 'Filmes',
    categoryItems: [
      {
        href: '/movies',
        title: 'Filmes',
        description: 'Todos os filmes',
        mainItem: true,
      },
    ],
  },
  {
    categoryTitle: 'Séries',
    categoryItems: [
      {
        href: '/series',
        title: 'Séries',
        description: 'Todas as séries',
        mainItem: true,
      },
    ],
  },
  {
    categoryTitle: 'Gêneros',
    categoryItems: [
      {
        href: '/genre?genreId=28&genreName=Ação&type=movie',
        title: 'Ação',
        description: 'Adrenalina, lutas e explosões',
        mainItem: true,
      },
      {
        href: '/genre?genreId=35&genreName=Comédia&type=movie',
        title: 'Comédia',
        description: 'Para dar boas risadas',
        mainItem: false,
      },
      {
        href: '/genre?genreId=18&genreName=Drama&type=movie',
        title: 'Drama',
        description: 'Histórias que emocionam',
        mainItem: false,
      },
      {
        href: '/genre?genreId=27&genreName=Terror&type=movie',
        title: 'Terror',
        description: 'Para quem gosta de sentir medo',
        mainItem: false,
      },
      {
        href: '/genre?genreId=878&genreName=Sci-Fi&type=movie',
        title: 'Sci-Fi',
        description: 'O futuro e além',
        mainItem: false,
      },
      {
        href: '/genre?genreId=16&genreName=Animação&type=movie',
        title: 'Animação',
        description: 'Para todas as idades',
        mainItem: false,
      },
      {
        href: '/genre?genreId=99&genreName=Documentários&type=movie',
        title: 'Documentários',
        description: 'Histórias reais, mundos reais',
        mainItem: false,
      },
      {
        href: '/genre?genreId=10749&genreName=Romance&type=movie',
        title: 'Romance',
        description: 'Amor e sentimentos',
        mainItem: false,
      },
    ],
  },
  {
    categoryTitle: 'Em Alta',
    categoryItems: [
      {
        href: '/home',
        title: 'Em Alta',
        description: 'Os mais assistidos agora',
        mainItem: true,
      },
    ],
  },
  {
    categoryTitle: 'Minha Lista',
    categoryItems: [
      {
        href: '/home',
        title: 'Minha Lista',
        description: 'Conteúdo salvo por você',
        mainItem: true,
      },
    ],
  },
]