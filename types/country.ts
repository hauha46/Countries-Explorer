export interface Country {
  name: {
    common: string;
    official: string;
  };
  cca3: string;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  capital: string[];
  region: string;
  subregion: string;
  population: number;
  languages?: {
    [key: string]: string;
  };
  currencies?: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  area: number;
}

export type Region = 'Africa' | 'Americas' | 'Asia' | 'Europe' | 'Oceania' | 'All';

export interface FavoriteCountry {
  countryId: string;
  note: string;
}
