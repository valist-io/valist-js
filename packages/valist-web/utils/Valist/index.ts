import { Client, ReleaseMeta } from "@valist/sdk";
import { utils } from "ethers";
import parseError from "../Errors";
import { dismiss, notify } from "../Notifications";
import { FileList } from '@/components/Files/FileUpload';
import { NextRouter } from "next/router";

export function getTeamID(teamName: string) {
  const nameBytes = utils.toUtf8Bytes(teamName);
  const nameHash = utils.keccak256(nameBytes);
  return utils.keccak256(
    utils.solidityPack(["uint256", "address"], [0x89, nameHash]),
  );
}

export function getProjectID(teamName: string, projectName: string) {
  const teamID = getTeamID(teamName);
  const nameBytes = utils.toUtf8Bytes(projectName);
  const nameHash = utils.keccak256(nameBytes);

  return utils.keccak256(
    utils.solidityPack(["uint256", "address"], [teamID, nameHash]),
  );
}

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
  console.log('input', projectID, valistCtx);
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