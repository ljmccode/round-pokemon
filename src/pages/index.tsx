/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { trpc } from '@/utils/trpc'
import { getOptionsForVote } from '@/utils/getRandomPokemon'
import PokemonListing from './components/PokemonListing'


export default function Home() {
  const [ids, updateIds] = useState(getOptionsForVote);
  const [first, second] = ids;

  const firstPokemon = trpc.getPokemonById.useQuery({ id: first})
  const secondPokemon = trpc.getPokemonById.useQuery({ id: second})

  const voteForRoundest = (selected:number) => {
    // todo: fire mutation to persist changes
    updateIds(getOptionsForVote)
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className='text-2xl text-center'>Which Pokemon is rounder?</div>
      <div className='p-2'></div>
      <div className='border rounded p-8 flex justify-between items-center max-w-2xl'>
        {!firstPokemon.isLoading && firstPokemon.data && !secondPokemon.isLoading && secondPokemon.data && (
          <>
          <PokemonListing pokemon={firstPokemon.data} vote={() => voteForRoundest(first)} />
          <div className='p-8'>Vs</div>
          <PokemonListing pokemon={secondPokemon.data} vote={() => voteForRoundest(second)} />
          </>
        )}
        <div className='p-2'></div>
      </div>
    </div>
  )
}

