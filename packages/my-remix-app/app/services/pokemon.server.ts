import axios from "axios";
import { PokemonDetails, PokemonList } from "~/types/pokemon-types";

export const getPokemonList = async () => {
  const response = await axios.get<PokemonList>(
    "https://pokeapi.co/api/v2/pokemon/"
  );

  return response.data;
};

export const getPokemonByName = async (name: string) => {
  const response = await axios.get<PokemonDetails>(
    `https://pokeapi.co/api/v2/pokemon/${name}`
  );

  console.log(`fetched pokemon`, { details: response.data });

  return response.data;
};
