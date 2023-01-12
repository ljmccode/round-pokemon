import { GetServerSideProps, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
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
  if (VoteFor + VoteAgainst === 0) return 0;
  return (VoteFor / (VoteFor + VoteAgainst)) * 100;
}

const PokemonResults: React.FC<{ pokemon: PokemonQueryResult[number], rank: number }> = ({
  pokemon,
  rank,
}) => {
  return (
    <div className="relative flex border-b p-2 items-center justify-between">
      <div className="flex items-center">
         <div className="flex items-center pl-4">
          <Image
            src={pokemon.spriteUrl}
            width={64}
            height={64}
            alt={pokemon.name}
          />
          <div className="pl-2 capitalize">{pokemon.name}</div>
        </div>
      </div>
      <div className="pr-4">
        {generateCountPercent(pokemon).toFixed(2) + "%"}
      </div>
      <div className="absolute top-0 left-0 z-20 flex items-center justify-center px-2 font-semibold text-white bg-gray-600 border border-gray-500 shadow-lg rounded-br-md">
        {rank}
      </div>
    </div>
  );
};

const ResultsPage: React.FC<{pokemon: PokemonQueryResult}> = (props) => {
  return (
    <div className='flex flex-col items-center'>
      <Head>
        <title>Roundest Pokemon Results</title>
      </Head>
      <h2 className='text-2xl p-4'>Results</h2>
      <Link className="p-4" href={'/'}>Back to Home</Link>
      <div className='flex flex-col w-full max-w-xl border'>
        {props.pokemon.sort((a,b) => {
          const difference = generateCountPercent(b) - generateCountPercent(a);
          if (difference === 0) return b._count.VoteFor - a._count.VoteFor
          return difference
        })
        .map((currentPokemon, index) => {
          return <PokemonResults pokemon={currentPokemon} key={currentPokemon.id} rank={index + 1} />
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