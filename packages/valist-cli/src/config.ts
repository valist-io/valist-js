import { InstallMeta } from '@valist/sdk';

export default class Config {
  public account?: string;
  public project?: string;
  public release?: string;
  public path?: string;
  public image?: string;
  public description?: string;
  public source?: string;
  public install?: InstallMeta;

  constructor(account: string, project: string, release: string, path: string) {
    this.account = account;
    this.project = project;
    this.release = release;
    this.path = path;
  }
}
