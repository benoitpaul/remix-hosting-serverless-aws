import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getPokemonByName } from "~/services/pokemon.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  console.log({ params });
  console.log(`fetching pokemon with name: ${params.name}`);
  const details = await getPokemonByName(params.name!);

  console.log(`fetched pokemon`, { details });

  return json({ details });
};

export default function PokemonDetailsPage() {
  const { details } = useLoaderData<typeof loader>();
  console.log({ details });
  return (
    <div>
      <h2>{details.name}</h2>
      <div>Weight: {details.weight}</div>
    </div>
  );
}
