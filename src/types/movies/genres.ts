
export interface IGenresResponse {
  name:string;
  id:number,
}

export interface IMDBGenresResponseDTO {
  genres: IGenresResponse[];
}