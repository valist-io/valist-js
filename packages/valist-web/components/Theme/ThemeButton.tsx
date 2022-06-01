import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { Sun, MoonStars } from 'tabler-icons-react';

export default function ThemeButton() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <ActionIcon
      className="flex"
      variant="transparent"
      style={{ color: dark ? 'white' : 'black' }}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <Sun size={18} /> : <MoonStars size={18} />}
    </ActionIcon>
  );
}