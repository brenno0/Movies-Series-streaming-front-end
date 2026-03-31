export interface Item {
  title: string
  image: string
  vote_average?: number;
  category: 'movie' | 'series',
  overview?: string,
  genre_ids:number[];
  backdropImage:string;
  id:number;
}
