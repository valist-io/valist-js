
export declare class InstallMeta {
  /** binary name */
  name?: string;
  /** darwin/amd64 path */
  darwin_amd64?: string;
  /** darwin/arm64 path */
  darwin_arm64?: string;
  /** linux/386 path */
  linux_386?: string;
  /** linux/amd64 path */
  linux_amd64?: string;
  /** linux/arm path */
  linux_arm?: string;
  /** linux/arm64 path */
  linux_arm64?: string;
  /** windows/386 path */
  windows_386?: string;
  /** windows/amd64 path */
  windows_amd64?: string;
}

export function getInstallPath(install: InstallMeta) {
  const platformArch = `${process.platform}/${process.arch}`;
  switch (platformArch) {
    case 'darwin/arm64':
      return install.darwin_arm64;
    case 'darwin/x64':
      return install.darwin_amd64;
    case 'win32/ia32':
      return install.windows_386;
    case 'win32/x64':
      return install.windows_amd64;
    case 'linux/ia32':
      return install.linux_386;
    case 'linux/x64':
      return install.linux_amd64;
    case 'linux/arm':
      return install.linux_arm;
    case 'linux/arm64':
      return install.linux_arm64;
  }
}

export function getExecCommand() {
  switch (process.platform) {
    case 'darwin':
      return 'open';
    case 'win32':
      return '';
    case 'linux':
      return '';
  }
}