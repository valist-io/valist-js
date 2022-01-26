
export type NavItem = {
  name: string,
  href?: string,
}

export type ActionItem = {
  name: string,
  href?: string,
  isLoggedIn: boolean,
  isMobile: boolean,
  action: (() => void),
}