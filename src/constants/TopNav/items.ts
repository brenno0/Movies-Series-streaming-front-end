import type { ITopNavCategories } from "@/types";

export const TopNavItems:ITopNavCategories[] = [
  {
    categoryTitle:'Início',
    categoryItems:[
      {
        href:'/home',
        title:'Início',
        description:'Veja os melhores filmes e séries. Encontre filmes recomendados e populares da semana',
        mainItem:true
      },
      {
        href:'/series',
        title:'Séries',
        description:'Busque e assista suas séries favoritas',
        mainItem:false,
      },
      {
        href:'/movies',
        title:'Filmes',
        description:'Busque e assista seus filmes favoritos',
        mainItem:false,
      }
    ]
  },
  {
    categoryTitle:'Canais de TV',
    categoryItems:[
      {
        href:'/TvChannels',
        title:'Canais',
        description:'Encontre seus canais favoritos, assista a filmes, séries, esportes, tudo em um só lugar.',
        mainItem:true
      },
    ]
  }
]