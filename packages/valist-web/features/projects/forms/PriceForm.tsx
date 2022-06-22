import React from 'react';
import { TextInput, Tooltip as MantineTooltip, useMantineTheme } from '@mantine/core';
import { useAppDispatch } from "../../../app/hooks";
import { setPrice, setLimit , setRoyalty , setRoyaltyAddress } from '../projectSlice';
import { AlertCircle as AlertCircleIcon } from 'tabler-icons-react';
import CopyButton from '@/components/CopyButton';
import { BigNumber } from 'ethers';

interface PriceFormProps {
    price: string;
    projectID: string;
    limit: string;
    royalty: string;
    royaltyAddress: string;
    mantineValidation: UseFormReturnType<any>;
  }
  
export const PriceForm = (props: PriceFormProps) => {
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
	const borderColor = theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[4];
  const backgroundColor = theme.colorScheme === 'dark' ? theme.colors.dark[0] : 'white !important';
  const color = theme.colorScheme === 'dark' ? 'white !important' : 'black !important';
  
  const rightSectionTooltip = (text: string) => {
      return (
          <MantineTooltip label={text} >
              <AlertCircleIcon size={16} style={{ display: 'block', opacity: 0.5 }} />
          </MantineTooltip>
      );
  };
    return (
      <form className="grid grid-cols-1 gap-y-6 sm:gap-x-8" action="#" method="POST">
        <div>
          <TextInput
               id="price"
               name="price"
               label="Price in MATIC"
               rightSection={rightSectionTooltip("The price to mint/purchase the license in MATIC. ERC-20 payments coming soon!")}
               type="number"
               min="0"
        
               {...props.mantineValidation.getInputProps('price')}
          ></TextInput>
        </div>
        <div>
          <TextInput
            id="limit"
            name="limit"
            label="Limit"
            rightSection={rightSectionTooltip("The maximum number of licenses that can be created.")}
            min="0"
        
            placeholder="0.00"
            {...props.mantineValidation.getInputProps('limit')}
          ></TextInput>
        </div>
        <div>
          <TextInput
           id="royalty"
           name="royalty"
           type="number"
           min="0"
        
           placeholder="0"
           label="Royalty Percent"
            rightSection={rightSectionTooltip("The percentage given to the project on re-sales.")}
            {...props.mantineValidation.getInputProps('royalty')}
          ></TextInput>
        </div>
        <div>
          <TextInput
            id="royaltyAddress"
            label="Royalty Address"
            rightSection={rightSectionTooltip("Editable display name on the project profile.")}
            name="royaltyAddress"
            type="text"
         
            required
            placeholder="0x00000000"
            {...props.mantineValidation.getInputProps('royaltyAddress')}
          >
          </TextInput>
        </div>
      </form>
    );
  };
  