/* eslint-disable react-hooks/rules-of-hooks */
import { Client, ProjectMeta, ReleaseMeta } from "@valist/sdk";
import { BigNumber, ethers, utils } from "ethers";
import parseError from "../Errors";
import { dismiss, notify } from "../Notifications";
import { FileList } from '@/components/Files/FileUpload';
import { NextRouter } from "next/router";
import { Asset } from "@/features/projects/ProjectGallery";
import { projectMetaChanged } from "../Validation";

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
    imgURL = await valistCtx.writeFile(accountImage[0].src as File);
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
    imgURL = await valistCtx.writeFile(releaseImage[0].src as File);
  }

  const release = new ReleaseMeta();
  release.image = imgURL;
  release.name = name;
  release.description = description;
  
  const uploadToast = notify('text', 'Uploading files...');

  // map the files to a format IPFS can handle
  const files: File[] = [];
  
  releaseFiles.map(file => {
    files.push(file.src as File);
  });

  console.log("FILES LENGTH", files)

  release.external_url = await valistCtx.writeFolder(files);
  console.log("DA EXTERNAL URL", release.external_url);
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

export const createOrUpdateProject = async (
  create: boolean,
  accountID: string,
  projectID: string,
  projectAccount: string,
  projectName: string,
  projectDisplayName: string,
  projectDescription: string,
  projectShortDescription: string,
  projectWebsite: string,
  projectMembers: string[],
  projectImage: FileList[],
  projectGallery: FileList[],
  projectType: string,
  projectTags: string[],
  projectPrice: string,
  projectRoyalty: string,
  projectRoyaltyAddress: string,
  projectLimit: string,
  projectAssets: Asset[],
  currentImage: string,
  previousMeta: ProjectMeta,
  youtubeUrl: string | null,
  router: NextRouter,
  valistCtx: Client,
) => {
  if (!projectID || !valistCtx) return;
  let toastID = '';
  let imgURL = currentImage;
  let galleryItems:Asset[] = (projectGallery.length !== 0) ? [] : [...projectAssets];

  const uploadToast = notify('text', 'Uploading files...');
  if (projectImage.length > 0) {
    imgURL = await valistCtx.writeFile(projectImage[0].src as File);
  } else {
    imgURL = currentImage;
  }

  if (youtubeUrl) {
    galleryItems.push({
      name: youtubeUrl,
      type: 'youtube',
      src: youtubeUrl,
    });
  }

  for (let i = 0; i < projectGallery.length; i++) {
    if (typeof projectGallery[i].src === "object") {
      const url = await valistCtx.writeFile({
        // @ts-ignore
        path: projectGallery[i].src.path,
        content: projectGallery[i].src,
      });

      galleryItems.push({
        name: projectGallery[i].name,
        type: projectGallery[i].type,
        src: url,
      });
    } else if (typeof projectGallery[i].src === "string") {
      galleryItems.push({
        name: projectGallery[i].name,
        type: projectGallery[i].type,
        // @ts-ignore
        src: projectGallery[i].src,
      });
    }
  };

  setTimeout(() => {
    // set artificial buffer for if upload is too quick, since react-hot-toast doesn't like when you call dismiss too fast
    dismiss(uploadToast);
  }, 300);

  const project = new ProjectMeta();
  project.image = imgURL;
  project.name = projectDisplayName;
  project.description = projectDescription;
  project.short_description = projectShortDescription;
  project.external_url = projectWebsite;
  project.type = projectType;
  project.tags = projectTags;
  project.gallery = galleryItems;

  console.log("Project Team", projectAccount);
  console.log("Project Name", projectName);
  console.log("Project Display Name", projectDisplayName);
  console.log("Project Members", projectMembers);
  console.log("Meta", project);

  try {
    const metaChanged = projectMetaChanged(previousMeta, project);
    console.log('create', create);
    // If create is true call createTeam else setProjectMeta
    let transaction: any;
    if (!create) {
      if (metaChanged) {
        toastID = notify('pending');
        transaction = await valistCtx.setProjectMeta(
          projectID,
          project,
        );

        dismiss(toastID);
        toastID = notify('transaction', transaction.hash);
        await transaction.wait();
      } else {
        notify('message', 'Project Meta has not changed.');
      }
    } else {
      toastID = notify('pending');
      transaction = await valistCtx.createProject(
        accountID,
        projectName,
        project,
        projectMembers,
      );

      dismiss(toastID);
      toastID = notify('transaction', transaction.hash);
      await transaction.wait();
    }

    dismiss();
    notify('success');

    const previousPrice = await valistCtx.getProductPrice(projectID) || 0;
    const currentPrice = ethers.utils.parseEther(projectPrice || '0');

    if (!currentPrice.eq(previousPrice)) {
      transaction = await valistCtx.setProductPrice(
        projectID,
        currentPrice,
      );

      dismiss(toastID);
      toastID = notify('transaction', transaction.hash);
      await transaction.wait();

      dismiss(toastID);
      notify('success');
    }

    const previousLimit = await valistCtx.getProductLimit(projectID);
    const currentLimit = BigNumber.from(projectLimit);

    if (!currentLimit.eq(previousLimit)) {
      transaction = await valistCtx.setProductLimit(
        projectID,
        currentLimit,
      );

      dismiss(toastID);
      toastID = notify('transaction', transaction.hash);
      await transaction.wait();

      dismiss(toastID);
      notify('success');
    }

    const _royalty = await valistCtx.getProductRoyaltyInfo(projectID, BigNumber.from(10000));
    const previousRoyalty = _royalty[1].div(100);
    const currentRoyalty = BigNumber.from(projectRoyalty);

    if (!currentRoyalty.eq(previousRoyalty)) {
      transaction = await valistCtx.setProductRoyalty(
        projectID,
        projectRoyaltyAddress,
        Number(currentRoyalty) * 100,
      );

      dismiss(toastID);
      toastID = notify('transaction', transaction.hash);
      await transaction.wait();

      dismiss(toastID);
      notify('success');
    }

    if (create) {
      router.push('/');
    }
  } catch(err) {
    console.log('Error', err);
    dismiss(toastID);
    notify('error', parseError(err));
  }
};

export const addAccountMember = async (
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

export const removeAccountMember = async (
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