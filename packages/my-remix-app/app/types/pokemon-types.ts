export type PokemonListEntry = {
  name: string;
};

export type PokemonList = {
  results: PokemonListEntry[];
};

export type PokemonDetails = {
  name: string;
  weight: number;
};
