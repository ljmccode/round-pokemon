import { RouterOutput } from "@/utils/trpc";
import Image from "next/image";

const PokemonListing: React.FC<{pokemon: PokemonFromServer; vote: () => void}> = (props) => {
  return (
    <div className='flex flex-col items-center'>
      <Image width={256} height={256} src={props.pokemon.spriteUrl ?? fallback} alt={props.pokemon.name}/>
      <div className="text-xl text-center capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>
      <button className={btn} onClick={() => props.vote()}>Rounder</button>
    </div>
  )
}

export default PokemonListing;

type PokemonFromServer = RouterOutput['getPokemonById']

const btn = "inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"

const fallback = "https://w7.pngwing.com/pngs/282/481/png-transparent-pokemon-pokeball-illustration-pikachu-ash-ketchum-pokemon-pokeball-pokemon-johto-technology.png"