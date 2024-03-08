import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getPokemonList } from "~/services/pokemon.server";

export const loader = async () => {
  const pokemonList = await getPokemonList();
  return json({ pokemonList });
};

export default function PokemonPage() {
  const { pokemonList } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Pokemon List</h1>
      <ul>
        {pokemonList.results.map((pokemon) => (
          <li key={pokemon.name}>
            <Link to={`/pokemon/${pokemon.name}`}>{pokemon.name}</Link>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  );
}
