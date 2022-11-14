import { PlatformsMeta, SupportedPlatform } from '@valist/sdk';

export default class Config {
  public account: string;
  public project: string;
  public release: string;
  public image?: string;
  public description?: string;
  public source?: string;
  public platforms: Record<SupportedPlatform, string>;

  constructor(account: string, project: string, release: string) {
    this.account = account;
    this.project = project;
    this.release = release;
    this.platforms = {
      web: '',
      darwin_amd64: '',
      darwin_arm64: '',
      windows_amd64: '',
      linux_amd64: '',
      linux_arm64: '',
      android_arm64: '',
    };
  }
}
