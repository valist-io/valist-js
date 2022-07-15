import { useMantineTheme } from "@mantine/core";

export default function Logo():JSX.Element {
  const theme = useMantineTheme();
  const logoSrc = theme.colorScheme === 'dark' ? `/images/logo-dark.svg` : `/images/logo-light.svg`;

  return (
    <img
      src={logoSrc} 
      alt="Logo"
      style={{ height: 40 }}
    />
  );
}