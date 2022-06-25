import React from 'react' ;
import { NextPage } from "next";
import Layout from "../components/Layouts/Main";
import HeroSection from '@/components/Discovery/HeroSection';
import Carousel, { Item } from '@/components/Discovery/Carousel';
import { Image } from '@mantine/core';
import getConfig from 'next/config';

const demoItem: Item[] = [
  {
    img: 'https://gateway.valist.io/ipfs/QmX9CGE2cpG61ZDTRLijZZG2kXJnXoL6aUdVqVaNPJPsVr',
    name: 'Coinfight',
    description: 'An RTS where you fight over crypto.',
    link: '/coinop-logan/coinfight',
    type: 'Game',
  },
  {
    img: 'https://gateway.valist.io/ipfs/QmaGDryDcRQqULRy8qqoiVNKLRwUGgZt8P9kYmCWSzcaqJ',
    name: 'MetaChess',
    description: 'Play and Earn:- Stake Crypto to play chess with friends and the winner takes all',
    link: '/metachess/metachessgame',
    type: 'Game',
  },
  {
    img: 'https://gateway.valist.io/ipfs/QmZfxfiHxPmJoGC8wgFbEr2mVXfrNzUnT8WYBeTiC5CEKq',
    name: 'ZenPond',
    description: 'Create a virtual pond and relax!',
    link: '/ivrl/zenpond',
    type: 'Game',
  },
  {
    img: 'https://pbs.twimg.com/profile_images/1499209010637152259/5ZYfm1jB_400x400.png',
    name: 'HashChat',
    description: 'An encrypted, cross-chain messaging platform built on web3 wallets.',
    link: 'max/hashchat',
    type: 'Application',
  },
];

const Discover: NextPage = () => {
  const { publicRuntimeConfig } = getConfig();

  if (publicRuntimeConfig.CHAIN_ID !== '137') {
    return (
      <Layout title="Valist | Discover">
        <div className="flex mt-20 lg:mt-32">
          <div className="m-auto">
            <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-indigo-500 sm:text-7xl">
              Coming Soon!
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
              Discover your favorite <b><i>software applications</i></b>, <b><i>libraries</i></b> and <b><i>games.</i></b> All on Web3!
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Valist | Discover">
      <HeroSection image={"/images/discovery/shattered_realms.png"} 
        title={'Shattered Realms'} 
        tagline={'Action, Adventure, RPG'} 
        link={'/shatteredrealms/game'} />
      <section style={{ marginTop: 20 }}>
       <Carousel items={demoItem} />
      </section>
      <section>
        <Image
          alt={'Featured Project'}
          src={'/images/discovery/publish_today.png'}
          fit="contain"
        />
      </section>
    </Layout>
  );
};

export default Discover;
