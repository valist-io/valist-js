import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { Sun, MoonStars } from 'tabler-icons-react';

export function ThemeButton() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
      variant="transparent"
    >
      { colorScheme === 'dark' && <Sun size={18} />}
      { colorScheme === 'light' && <MoonStars size={18} />}
    </ActionIcon>
  );
}