import type { NextPage } from 'next';
import { Layout } from '@/components/Layout';
import { HeroSection, Carousel, PublishPromo, DiscoveryFooter, CardGrid, Button } from '@valist/ui';
import { useMediaQuery } from '@mantine/hooks';
import { CarouselItem } from '@valist/ui/dist/components/Carousel';
import { useQuery } from '@apollo/client';
import query from '@/graphql/Discover.graphql';
import { Metadata } from '@/components/Metadata';
import { Anchor, Avatar, Center, SimpleGrid, Text } from '@mantine/core';
import { useState } from 'react';

const Discover: NextPage = () => {
  const [latestIndex, setLatestIndex] = useState(12);
  const { data } = useQuery(query, { 
    variables: { order: 'desc' },
  });

  const accounts = data?.accounts;

  // let accountCounts: Record<string, number> = {};
  // data?.accounts?.forEach((account: any) =>
  //   account?.projects.forEach((project: any) => {
  //     accountCounts[account?.name] = accountCounts[account?.name] + project.releases.length; 
  //   }));
  // let accounts = [];

  console.log('accounts', accounts);

  let pairs: Record<string, boolean> = {};

  const projects = data?.releases.map((release: any) => {
    if (!pairs[`${release.project.account.name}/${release.project.name}`]) {
        pairs[`${release.project.account.name}/${release.project.name}`] = true;
        return release.project;
    }
  }).filter(Boolean) || []; // sorted by release (last updated)

  const sortedProjects = [...projects].sort((a: any, b: any) => parseFloat(b.blockTime) - parseFloat(a.blockTime));

  // const latestNative = projects.filter((project: any) => project.type == 'native'); // @TODO needs to come from logs instead of releases
  
  const isMobile = useMediaQuery('(max-width: 900px)');
  const paddingY = isMobile ? '24px' : '64px';
  
  const featuredGames: any[] = [
    {
      img: 'https://gateway.valist.io/ipfs/bafkreig2os6zpf6crsiqhwg5i3si7f2u474fnihbxoucb6ifxnmhfar6fi',
      name: 'MintWorld',
      description: "Catch, Fight, and Collect Monsters!",
      link: '/mintworld/mintworld',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafybeihavc5tjkdp6gt3hqmvm3kbkahnvfbxupkwbjs5jlehprsuisnm5u',
      name: 'Now Kith',
      description: "A 5-level puzzle game with 3-bonus rounds. Combine two objects together to get the desired result.",
      link: '/devbymarc/now_kith',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafybeicss3okei2isjmlnpuqaupd6jzclnehdiiyqihvle34pukbpkrcbe',
      name: 'ok ima fight',
      description: "After spending the last few weeks training in your father's gym, the time has come to put your hands to the test and hit the ring for the very first time.",
      link: '/devbymarc/ok_ima_fight',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafybeigk2o6or3sm4aybjdcvmy2tpkylkc76hppmdhalb7e4sgmubcwfqy',
      name: 'Shattered Realms',
      description: "A 90's style J-RPG inspired by the standard imposed by Square-Enix.",
      link: '/shatteredrealms/game',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafkreih5o5d5yaoxcybgofh5fmgjqvmsbey3utfd2ataw2akg7anliqz5i',
      name: 'The Nicest Game Ever!',
      description: "Simply get to the nicest number, 69 on one turn by completing the operation.",
      link: '/devbymarc/the_nicest_game_ever',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafkreic7744zqwznyilyzaejn5fzgatc3xec6nv3qv3ehn3gwn6uokkxha',
      name: 'Evil School, Evil Kids',
      description: "This is a simple racing game where you are racing in an evil school.",
      link: '/awesomekalin55/racing-evil-school-child',
      type: 'native',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafkreihdll5sagpqdxoy53usolho7vlhuqed4geuz75vrid2pj2nk2btci',
      name: 'Aquatic Race',
      description: "Are you coming here after RMESEC? Is it too hard? Well, you've come to the right place! Here you can just play and practise at your own pace!",
      link: '/awesomekalin55/aquatic-race',
      type: 'native',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafybeifmvik5e3pctmpj233bbeqdmpqssyl5cxrthtpmbumw2gfbzbhelq',
      name: 'VoxelVerse',
      description: 'An open-world MetaVerse with a community driven game mechanic.',
      link: '/kbryan/hackfs2022',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/QmZfxfiHxPmJoGC8wgFbEr2mVXfrNzUnT8WYBeTiC5CEKq',
      name: 'ZenPond',
      description: 'Create a virtual pond and relax!',
      link: '/ivrl/zenpond',
      type: 'native',
    },
    {
      img: 'https://gateway.valist.io/ipfs/QmX9CGE2cpG61ZDTRLijZZG2kXJnXoL6aUdVqVaNPJPsVr',
      name: 'Coinfight',
      description: 'An RTS where you fight over crypto.',
      link: '/coinop-logan/coinfight',
      type: 'native',
    },
  ];

  const featuredApps: any[] = [
    {
      img: 'https://gateway.valist.io/ipfs/QmXf81mLFFa1UA8QGMTU8a7kdFeNFmKytfZtTnutv9KVJN',
      name: 'Berty',
      description: 'A messenger that is as easy to use as it is secure.',
      link: '/berty/berty',
      type: 'native',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafkreiapnho6rklrdgv5nihn5mwyeok2lvm4xzq2blswpr3vdy5nkzv63i',
      name: 'SurfDB',
      description: 'Decentralized database built on top of ceramic and cached using redis for fast response times.',
      link: '/surfdb/surfdb',
      type: 'native',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafybeibg5wxyks4m2j3r6euzgilbfelfczyxizvqt5sv7wdf22h4okcrhq',
      name: 'NFTicket',
      description: 'This dApp allows you to get access to tickets as NFTs.',
      link: '/abbas-khan/nfticket',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafkreial2z6akpzox3bbrzhf6ocguzs265ymhb37ektremkdigdexo25vu',
      name: 'dDrive',
      description: 'An alternative storage solution to Google Drive, open-source, fully decentralized, and built on IPFS.',
      link: '/d-drive/d-drive-pwa',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/QmYRcBZuTswhDs63wnmpy3zszD3QUmDDR97dNJtXBdWf3t',
      name: 'Music3',
      description: 'Store music on IPFS in single Click.',
      link: '/0xdhruv/music3',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafkreidizb6xussoa4xp2hlu63expjugdr3hisk4yr36mujkm5k3obesb4',
      name: 'Clover',
      description: 'Clover enables DAOs to store files collectively while allowing them to chat.',
      link: '/lucid/clover',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafkreidbzttzxd5p3kvwrptoy2qvw4ypx54wvqwyl7ze2ga36er5mfrnt4',
      name: 'Right Share',
      description: 'Hassle-free Even though it\’s a Web3 Application, we hide everything that\’s no needed away from you for the best sharing experience. No wallet, no gas!',
      link: '/rightsahre/rightshare',
      type: 'native',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafkreidsl63zufa2ixcpxiexbd7s343kmv4wdektmjeegh5n6tdnpl5ehi',
      name: 'dearwebthree',
      description: 'Decentralized database built on top of ceramic and cached using redis for fast response times.',
      link: '/blockchainaholic/dearwebthree',
      type: 'native',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafybeiblhylduxfwxqn5ucmrjml4tnpg5rmphumln4jsedkakkzitxmd5a',
      name: 'Pecunia',
      description: 'Safe and Secure Cryptocurrency Estate Planning using ZK Snarks and Chainlink Keepers.',
      link: '/pecunia/pecunia',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/QmWhnyhXb1ahhsuWBRvXdpNg51KH8f2zfkJyyhmpqBvuSa',
      name: 'Pap3rs',
      description: 'An easy mechanism for academics or researchers to publish research to IPFS.',
      link: '/chris13524/pap3rs',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafybeib5okoy4gu24jym46dfwjfq6zxvtxx4m7vd3r7n2dzyavtwymp57m',
      name: '0xfi',
      description: 'A DeFi plus DeSo platform to manage and receive money in a single platform.',
      link: '/0xdhruv/0xfi',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafybeib74veyjuejwcc6tt26fs4x5thhc4hwn6vpkchwxgnmiub7x7g5oa',
      name: 'Sound Click',
      description: 'SoundClick was created for you; the writer, the performer, the beat maker, the producer, the engineer, the record label, the publisher, the videographer, the artist, and the CREATOR.',
      link: '/4metaverse-marcial-yahoo/sound-click',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafkreiazt2xf5nbvy7vruiz3mfnbgqgbcm6ysv2quvfirgrttpv25ahrya',
      name: 'Unblock Receipts',
      description: 'UnblockReceipts gives you a receipt for your gas fees on Ethereum that you can use in expense reports.',
      link: '/unblockreceipts/unblockreceipts',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafkreidf33irjtdo2nxe7ssed634cr7hbq677lieemqvejtofbkrufa4yq',
      name: 'Lens Note',
      description: 'LensNote enables you to create and share personal notes which can be reacted, collected, and mirrored.',
      link: '/blockchainaholic/lensnote',
      type: 'web',
    },
    {
      img: 'https://pbs.twimg.com/profile_images/1499209010637152259/5ZYfm1jB_400x400.png',
      name: 'HashChat',
      description: 'An encrypted, cross-chain messaging platform built on web3 wallets.',
      link: '/max/hashchat',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/QmaPtGEpTsKub4ZfXiKzrF5YzqBkh9c4rVC5APr2yLSgJZ',
      name: 'Split/3',
      description: 'The web3 version of Splitwise',
      link: '/chris13524/split3',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/QmV9n331gHhs87pwp5XXZ48ysQM5jKzKP7ovKTZ6nRPJaL',
      name: 'NFT Safe Launch',
      description: 'Create a smart contract that locks the funds of an ERC-721 until some condition is met.',
      link: '/nftsafelaunch/nftsafelaunch',
      type: 'web',
    },
  ];

  const featuredTestnet: any[] = [
    {
      img: 'https://gateway.valist.io/ipfs/bafybeieuzkvucsguhcdw3kqd3itkf7hht57ncos4z72pqir6mnmu5hkn6y',
      name: 'Hanging Tower',
      description: 'Hanging Tower is metaverse blockchain game, where user can play solo or PvP in multiplayer with voice chat, earn free daily rewards.',
      link: 'https://testnets.valist.io/tgs/hanging_tower',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafkreibgpkeq447piii33ebag3eiysd435uga4fl3vrl2oqa7knf4wxrcq',
      name: 'Socio Funverse',
      description: 'Socio Funverse.',
      link: 'https://testnets.valist.io/coinexgame/sociofunverse',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafkreiel7yocfta44glepfbyhqew6mxdahcep5zgzfjqviacfpcti3vlmi',
      name: 'Snake Mania',
      description: 'Snake Mania is classic web3 game with DeFi, NFT-1155, ERC-20 token based fun and entertaining game.',
      link: 'https://testnets.valist.io/tgs/snakemania',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafkreieeq2ahtjaa6kod2scor4n3ua5rghh2hlc4tprqjuzzji4cghqxqm',
      name: 'Meta Maze',
      description: 'Meta Maze Game Meta maze is metaverse game where players can create their own maze puzzle and mint as NFT 1155.',
      link: 'https://testnets.valist.io/etho_metamaze/meta_maze',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafybeibhh2asafyhmb7pimg2uynftpxf2vwc4ilwv7jdhxju4yrs2hssvu',
      name: 'MyMetapets',
      description: 'Raise, breed, and sell fish in the metaverse!',
      link: 'https://testnets.valist.io/mymetapets/mymetapets',
      type: 'web',
    },
    {
      img: 'https://gateway.valist.io/ipfs/bafybeibuog2xallbya3baunvqjivlzevweoxvd45tovqsbjh2d4nz54lau',
      name: 'Farming RPG',
      description: 'The game contains basic functionality of farming RPG (farming, chopping, clearing ground, harvesting, removing obstacles etc).',
      link: 'https://testnets.valist.io/kar/farming_rpg_moralis',
      type: 'native',
    },
  ];
  
	return (
    <div style={{ overflow: 'hidden' }}>
      <Layout hideNavbar={true} padding={0}>
          <section>
            <HeroSection
              image={"/images/discovery/shattered_realms.png"} 
              title={'Shattered Realms'} 
              tagline={'Action, Adventure, RPG'} 
              link={'/shatteredrealms/game'}
          /> 
          </section>
          
          <section style={{ marginTop: 56, padding: `0 ${paddingY}` }}>
              <Carousel title={"Featured Games"} number={5} items={featuredGames} />
          </section>

          <section style={{ marginTop: 56, padding: `0 ${paddingY}` }}>
              <Carousel title={"Featured dApps"} number={5} items={featuredApps} />
          </section>

          <section style={{ marginTop: 56, padding: `0 ${paddingY}` }}>
              <Carousel title={"Featured on Testnet"} number={5} items={featuredTestnet} />
          </section>

          <section style={{ marginTop: 56, padding: `0 ${paddingY}` }}>
            <h2 style={{ fontStyle: 'normal', fontWeight: 700, fontSize: isMobile ? 18 : 32 }}>Recently Updated</h2>
            {projects.length !== 0 &&
                <SimpleGrid
                  breakpoints={[
                    { minWidth: 'sm', cols: 1, spacing: 24 },
                    { minWidth: 'md', cols: 2, spacing: 24 },
                    { minWidth: 'lg', cols: 4, spacing: 16 },
                  ]}
                >
                  {projects.slice(0, 8).map((project: any, index: number) =>
                    <Metadata key={index} url={project.metaURI}>
                      {(data: any) =>
                        <CarouselItem 
                          img={data?.image || '/images/valist.png'} 
                          name={data?.name} 
                          description={data?.description} 
                          link={`/${project.account.name}/${project?.name}`}
                          type={data?.type}
                        />
                      }
                    </Metadata>,
                  )}
                </SimpleGrid>
            }
          </section>

          <section style={{ marginTop: 56, padding: `0 ${paddingY}` }}>
            <h2 style={{ fontStyle: 'normal', fontWeight: 700, fontSize: isMobile ? 18 : 32 }}>Newest Apps and Games</h2>
            {sortedProjects.length !== 0 &&
              <>
                <SimpleGrid
                  breakpoints={[
                    { minWidth: 'sm', cols: 1, spacing: 24 },
                    { minWidth: 'md', cols: 2, spacing: 24 },
                    { minWidth: 'lg', cols: 4, spacing: 16 },
                  ]}
                >
                  {sortedProjects.slice(0, latestIndex).map((project: any, index: number) =>
                    <Metadata key={index} url={project.metaURI}>
                      {(data: any) =>
                        <CarouselItem 
                          img={data?.image || '/images/valist.png'} 
                          name={data?.name} 
                          description={data?.description} 
                          link={`/${project.account.name}/${project?.name}`}
                          type={data?.type}
                        />
                      }
                    </Metadata>,
                  )}
                </SimpleGrid>
                <Center>
                  <Button
                    style={{ margin: '30px 0 60px 0' }} 
                    onClick={() => setLatestIndex(latestIndex + 12)}
                  >
                  Load More
                </Button>
               </Center>
              </>
            }
          </section>

          <section>
              <PublishPromo />
          </section>
          
          <section>
              <DiscoveryFooter />
          </section>
      </Layout>
    </div>
	);
};

export default Discover;
