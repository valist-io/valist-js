import { Center, Loader, Text } from "@mantine/core";

export function LoadingScreen():JSX.Element {
  return (
    <>
      <Center>
        <Text style={{ fontSize: 35, margin: '20px auto', fontWeight: 100 }}>
          Loading Account Info
        </Text>
      </Center>
      <Center>
        <Loader color="violet" size='xl' />
      </Center>
    </>
  );
}