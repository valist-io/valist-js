// import { Anchor } from "@mantine/core";
// import { Client } from "@valist/sdk";

// export async function linkRepo(
//   projectId: string,
//   image: File | undefined,
//   mainCapsule: File | undefined,
//   gallery: File[],
//   valist: Client,
//   cache: ApolloCache<any>,
//   chainId: number,
// ) {

//   if (!address) {
//     throw new Error('connect your wallet to continue');
//   }

//   utils.updateLoading('Creating transaction');
//   const transaction = await valist.setProjectMeta(projectId, meta);

//   const message = <Anchor target="_blank"  href = { getBlockExplorer(chainId, transaction.hash) } > Waiting for transaction - View transaction < /Anchor>;
//   utils.updateLoading(message);

//   const receipt = await transaction.wait();
//   receipt.events?.forEach(event => handleEvent(event, cache));

// }