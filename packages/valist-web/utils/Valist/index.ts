/* eslint-disable react-hooks/rules-of-hooks */
import { Client, ReleaseMeta } from "@valist/sdk";
import { utils } from "ethers";
import parseError from "../Errors";
import { dismiss, notify } from "../Notifications";
import { FileList } from '@/components/Files/FileUpload';
import { NextRouter } from "next/router";

export const getTeamID = (teamName: string) => {
  const nameBytes = utils.toUtf8Bytes(teamName);
  const nameHash = utils.keccak256(nameBytes);
  return utils.keccak256(
    utils.solidityPack(["uint256", "address"], [0x89, nameHash]),
  );
};

export const getProjectID = (teamName: string, projectName: string) => {
  const teamID = getTeamID(teamName);
  const nameBytes = utils.toUtf8Bytes(projectName);
  const nameHash = utils.keccak256(nameBytes);

  return utils.keccak256(
    utils.solidityPack(["uint256", "address"], [teamID, nameHash]),
  );
};

// Wrap Valist Sdk call for create or update account
export const createOrUpdateAccount = async (
  create: boolean,
  accountUsername: string,
  accountID: string,
  accountDisplayName: string,
  accountDescription: string,
  accountWebsite: string,
  accountMembers: string[],
  accountImage: FileList[],
  currentImage: string,
  router: NextRouter,
  valistCtx: Client,
  afterComplete: () => void,
) => {
  if (!accountID || !valistCtx) return;
  let imgURL = "";

  if (accountImage.length > 0) {
    imgURL = await valistCtx.writeFile({
      // @ts-ignore
      path: accountImage[0].src.path,
      content: accountImage[0].src,
    });
  } else {
    imgURL = currentImage;
  }

  const meta = {
    image: imgURL,
    name: accountDisplayName,
    description: accountDescription,
    external_url: accountWebsite,
  };

  console.log("Account Username", accountUsername);
  console.log("Account Members", accountMembers);
  console.log("Meta", meta);

  let toastID = '';
  try { 
    toastID = notify('pending');

    // If create, call createTeam else setTeamMeta 
    let transaction: any;
    if (!create) {
      transaction = await valistCtx.setAccountMeta(accountID, meta);
    } else {
      transaction = await valistCtx.createAccount(
        accountUsername,
        meta,
        accountMembers,
      );
    }
    
    dismiss(toastID);
    toastID = notify('transaction', transaction.hash);
    await transaction.wait();

    dismiss(toastID);
    notify('success');

    if (create) {
      afterComplete();
      router.push('/create/project');
    }
   
  } catch(err) {
    dismiss(toastID);
    notify('error', parseError(err));
  }
};

export const createRelease = async (
  account: string,
  project: string,
  projectID: string,
  name: string,
  description: string,
  releaseImage: FileList[],
  releaseFiles: FileList[],
  router: NextRouter,
  valistCtx: Client,
) => {
  if (!projectID || !valistCtx) return;
  let imgURL = "";

  if (releaseImage.length !== 0) {
    imgURL = await valistCtx.writeFile(releaseImage[0].src);
  }

  const release = new ReleaseMeta();
  release.image = imgURL;
  release.name = name;
  release.description = description;
  
  const uploadToast = notify('text', 'Uploading files...');

  // map the files to a format IPFS can handle
  const files: { path: string, content: File }[] = [];
  
  releaseFiles.map(file => {
    // @ts-ignore
    files.push({ path: file.src.path, content: file.src });
  });

  release.external_url = await valistCtx.writeFolder(files);
  dismiss(uploadToast);

  console.log("Release Team", account);
  console.log("Release Project", project);
  console.log("Release Name", name);
  console.log("Meta", release);

  let toastID = '';
  try {
    toastID = notify('pending');
    const transaction = await valistCtx.createRelease(
      projectID,
      name,
      release,
    );

    dismiss(toastID);
    toastID = notify('transaction', transaction.hash);
    await transaction.wait();
    
    dismiss(toastID);
    notify('success');
    router.push('/');
  } catch(err: any) {
    console.log('Error', err);
    dismiss(toastID);
    notify('error', parseError(err));
  }
};

export const addMember = async (
  address: string,
  accountUsername: string,
  accountID: string,
  valistCtx: Client,
) => {
  console.log(`Adding ${address} to ${accountUsername}`);
  let toastID = '';
  let transaction;

  if (accountID && valistCtx) {
    try {
      toastID = notify('pending');
      console.log('accountUsername', accountUsername);
      console.log('address', address);
      transaction = await valistCtx.addAccountMember(accountID, address);
      dismiss(toastID);
      toastID = notify('transaction', transaction.hash);
      await transaction.wait();
      dismiss(toastID);
      notify('success');
    } catch(err) {
      dismiss(toastID);
      notify('error', parseError(err));
    }

    dismiss(toastID);
  }
};

export const removeMember = async (
  address: string,
  accountUsername: string,
  accountID: string,
  valistCtx: Client,
) =>  {
  console.log(`Removing ${address} from ${accountUsername}`);
  let toastID = '';
  let transaction: any;

  if (accountID && valistCtx) {
    try {
      toastID = notify('pending');
      transaction = await valistCtx.removeAccountMember(accountID, address);
      dismiss(toastID);
      toastID = notify('transaction', transaction.hash);
      await transaction.wait();
      dismiss(toastID);
      notify('success');
    } catch(err) {
      dismiss(toastID);
      notify('error', parseError(err));
    }

    dismiss(toastID);
  }
};

export const getBlockExplorer = (chainID: string) => {
  switch(chainID) {
    case '137':
      return 'https://polygonscan.com';
    case '80001':
      return 'https://mumbai.polygonscan.com';
    case '1':
      return 'https://etherscan.com';
    default:
      return 'https://polygonscan.com';
  }
};