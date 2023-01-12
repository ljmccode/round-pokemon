/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { trpc } from '@/utils/trpc'
import { getOptionsForVote } from '@/utils/getRandomPokemon'
import PokemonListing from '../components/PokemonListing'


export default function Home() {
  const [ids, updateIds] = useState(getOptionsForVote);
  const [first, second] = ids;

  const firstPokemon = trpc.getPokemonById.useQuery({ id: first})
  const secondPokemon = trpc.getPokemonById.useQuery({ id: second})

  const voteMutation = trpc.castVote.useMutation();

  const voteForRoundest = (selected:number) => {
    if (selected === first) {
      voteMutation.mutate({votedFor: first, votedAgainst: second})
    } else {
      voteMutation.mutate({votedFor: second, votedAgainst: first})
    }
    // todo: fire mutation to persist changes
    updateIds(getOptionsForVote)
  }

  const dataLoaded = !firstPokemon.isLoading && firstPokemon.data && !secondPokemon.isLoading && secondPokemon.data
  
  return (
    <div className="h-screen w-screen flex flex-col justify-between items-center relative">
      <div className='text-2xl text-center pt-8'>Which Pokemon is rounder?</div>
      
        {dataLoaded && (
          <div className='border rounded p-8 flex justify-between items-center max-w-2xl'>
          <PokemonListing pokemon={firstPokemon.data} vote={() => voteForRoundest(first)} />
          <div className='p-8'>Vs</div>
          <PokemonListing pokemon={secondPokemon.data} vote={() => voteForRoundest(second)} />
          <div className='p-2' />
          </div>
          
        )}
      {!dataLoaded && (<img className="w-48" src="/rings.svg" alt="loader"/>)}
      <div className="w-full text-xl text-center pb-4">
        <Link href="/results">
          Results
        </Link>
      </div>
    </div>
  )
}

