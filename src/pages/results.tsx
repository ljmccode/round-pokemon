import { GetServerSideProps, GetStaticProps } from 'next';
import { prisma } from '@/server/utils/prisma';
import { AsyncReturnType } from '@/utils/ts-bs';
import Image from 'next/image';

const getPokemonInOrder = async () => {
  return await prisma.pokemon.findMany({
    orderBy: {
      VoteFor: { _count: "desc"},
    },
    select: {
      id: true,
      name: true,
      spriteUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true
        }
      }
    }
  })
}

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const generateCountPercent = (pokemon: PokemonQueryResult[number]) => {
  const {VoteFor, VoteAgainst} = pokemon._count;
  if (VoteFor+ VoteAgainst === 0) return 0;
  return VoteFor / (VoteFor + VoteAgainst) * 100;
}

const PokemonResults: React.FC<{pokemon: PokemonQueryResult[number]}> = ({pokemon}) => {
  return <div className='flex border-b p-4 items-center justify-between'>
    <div className='flex items-center'>
    <Image 
      src={pokemon.spriteUrl}
      width={64}
      height={64}
      alt={pokemon.name}
    />
    <div className='capitalize'>{pokemon.name}</div>
    </div>
    <div className='pr-4'>{generateCountPercent(pokemon) + "%"}</div>
  </div>
}

const ResultsPage: React.FC<{pokemon: PokemonQueryResult}> = (props) => {
  return (
    <div className='flex flex-col items-center'>
      <h2 className='text-2xl p-4'>Results</h2>
      <div className='p-2'></div>
      <div className='flex flex-col w-full max-w-2xl border'>
        {props.pokemon.map((currentPokemon) => {
          return (
            <PokemonResults pokemon={currentPokemon} key={currentPokemon.id}/>
            )
        })}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {

  const pokemonOrdered = await getPokemonInOrder();
  return {
    props:{
      pokemon: pokemonOrdered
    },
    // Next.js will attempt to re-generate the page when a request comes in at most once every 60 seconds
    revalidate: 60
  }
}

export default ResultsPage;