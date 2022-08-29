import { Client } from "@valist/sdk";

declare global {
  interface Window {
    electron: any;
  }
}

export const onInstallProgress = async (
  action: (event: any, progress: number) => void,
) => {
  window?.electron.onInstallProgress((event: any, progress: number) => {
    action(event, progress);
  });
};

export const install = async (
  valist: Client,
  accountName: string,
  projectName: string,
  projectType: string,
  onInstall?: (progress: number) => void,
) => {
  const accountID = valist.generateID(137, accountName);
  const projectID = valist.generateID(accountID, projectName);
  const releaseID = await valist.getLatestReleaseID(projectID);
  const release = await valist.getReleaseMeta(releaseID);

  if (window?.electron) {
    // TODO not sure if should garbage collect this, but probably not an issue
    if (projectType === 'native') {
      onInstallProgress((event: any, progress: number) => {
        if (onInstall) onInstall(progress);
      });
    }

    return await window?.electron.install(
      {
        projectID,
        name: `${accountName}/${projectName}`,
        version: release.name,
        type: projectType,
        release: release,
      },
    );
  }
};

export const uninstall = async (
  projectId: string,
) => {
  if (window?.electron) {
    await window?.electron?.uninstall(projectId);
  };
};

export const getApps = async () => {
  return await window?.electron?.getApps();
};

export const launch = async (project: any, type: string, releasePath?: string, valist?: Client) => {
  if (type === 'native') {
    await window?.electron?.launch(project?.id);
  } else {
    const apps = await getApps();
    window.open(releasePath);

    console.log('install values',
      valist,
      project?.account?.name,
      project?.name,
      type,
    );

    if (valist && !(project?.id in apps) && project?.account && project?.name) {
      install(
        valist,
        project?.account?.name,
        project?.name,
        type,
      );
    }
  }
};

export const checkIsElectron = () => (typeof window) !== "undefined" ? true : false;