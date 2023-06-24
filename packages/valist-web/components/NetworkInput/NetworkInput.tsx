import { defaultNetworks } from "@/forms/common";
import { Button, Flex, Group, Select, Text, TextInput } from "@mantine/core";
import { useState } from "react";

interface NetworkInputProps {
  form: any;
  loading: boolean;
}

export function NetworkInput(props: NetworkInputProps):JSX.Element {
  const [networks, setNetworks] = useState(defaultNetworks);
  const [newChain, setNewChain] = useState<string>('1');
  const [newContract, setNewContract] = useState<string>('');

  return (
    <div>
      <Text>Add Networks and or Contract Addresses</Text>
      <Group>
        <Select
          data={networks}
          placeholder="Network"
          nothingFound="Nothing found"
          required
          searchable
          creatable
          getCreateLabel={(query) => `+ Create chain ${query}`}
          onCreate={(query) => {
            if (!Number(query)) return;
            const item = { value: query, label: query };
            setNetworks((current: any) => [...current, item]);
            return item;
          }}
          onChange={((value) => setNewChain(value || ""))}
        />
        <TextInput 
          placeholder="Address"
          value={newContract}
          onChange={((e) => setNewContract(e.target.value || ""))}
          disabled={props.loading}
        />
        <Button
          onClick={() => {
            const chainIndex = props.form.values.networks.findIndex((network: { chainId: string; }) => network.chainId === newChain);
            if (chainIndex === -1) {
              props.form.insertListItem('networks', { 
                chainId: newChain,
                address: [newContract],
              });
            } else {
              const chain  = props.form.values.networks[chainIndex];
              chain.address?.push(newContract);
              props.form.setFieldValue(`networks.${chainIndex}`, chain);
              setNewContract("");
            }
        }}>
          Add
        </Button>
      </Group>
      <Flex mt="lg" direction="column" gap="lg">
        {props.form.values.networks.map((network:{address: string, chainId: string,}, index: number) => (
          <div key={index}>
            <Text size="lg">Chain: {network?.chainId}</Text> 
            Contracts: {JSON.stringify(network?.address || [])}
          </div>
        ))}
      </Flex>
    </div> 
  );
}