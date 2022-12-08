import { Button, Center, Select, TextInput, Title } from "@mantine/core";

export function CreateProject():JSX.Element {
  return (
    <section>
      <Center><Title my="lg" order={3}>Create your first Account & Project</Title></Center>
      <TextInput
        my='lg'
        label='Account Name (cannot be changed)'
        required
      />
      <TextInput
        my='lg'
        label='Project Name (cannot be changed)'
        required 
      />
      <Select
        my='lg'
        label="Type"
        data={[]}
        placeholder="Select type"
        required
      />
      <Center>
        <Button
          my='lg' 
          variant="default" 
          onClick={() => {}}>
            Create
        </Button>
      </Center>
    </section>
  );
};