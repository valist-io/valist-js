import { tokens } from "@/utils/tokens";
import { Group, NumberInput, Select } from "@mantine/core";

interface DonationInput {
  currency: number;
  onChange: any;
  setCurrency: any;
}

export function DonationInput(props: DonationInput):JSX.Element {
  return (
    <Group spacing={'sm'}>
      <Select
        defaultValue={tokens.map((token, index) => index)[0].toString()}
        onChange={props?.setCurrency} 
        data={tokens.map((token, index) => 
          ({
            label: token.name,
            value: index.toString(), 
          }),
        )}
      />
      <NumberInput
        placeholder='2.0'
        onChange={(value) => props.onChange(value || 0)}
        min={0}
        precision={4}
        hideControls
      />
    </Group>
  );
}