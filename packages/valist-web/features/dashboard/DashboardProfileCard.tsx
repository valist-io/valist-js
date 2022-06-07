import { useContext, useEffect, useState } from "react";
import { SetUseState } from "../../utils/Account/types";
import { truncate } from "../../utils/Formatting/truncate";
import AccountPicker from "../accounts/AccountPicker";
import AddressIdenticon from "../../components/Identicons/AddressIdenticon";
import Tabs from "../../components/Tabs";
import { useAppSelector } from "../../app/hooks";
import { selectAddress } from "../accounts/accountsSlice";
import Web3Context from "../valist/Web3Context";
import { Anchor, Paper, Skeleton, Text } from "@mantine/core";
import { ChevronIcon } from "@mantine/core/lib/components/Select/SelectRightSection/ChevronIcon";
import { useColorScheme } from "@mantine/hooks";

interface HomepageProfileCardProps {
  isProjects: boolean;
  isAccounts: boolean;
  view: string;
  accountNames: string[];
  userAccount: string;
  setView: SetUseState<string>;
}

export default function HomepageProfileCard(props:HomepageProfileCardProps) {
  const web3Ctx = useContext(Web3Context);
  const address = useAppSelector(selectAddress);
  const colorScheme = useColorScheme();
  const [ens, setEns] = useState<string | null>();
  const tabs = [
    {
      text: 'Projects',
      disabled: !props.isAccounts,
    },
    {
      text: 'Activity',
      disabled: false,
    },
  ];

  useEffect(() => {
    (async () => {
      let value = null;

      if (address !== '0x0') {
        try {
          value = await web3Ctx.reverseEns(address);
        } catch (err) {}
      }

      setEns(value);
    })();
  }, [address, web3Ctx.reverseEns]);

  return (
    <section aria-labelledby="dashboard-overview-title">
       <Paper style={{ paddingBottom: 0 }} shadow="xs" p="xl" radius="md" withBorder>
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-5 mr-10">
              <div>
                <AddressIdenticon address={address} height={85} width={85} />
              </div>
              <div style={{ display: "flex", marginTop: "auto", marginBottom: "auto" }}>
                <div>
                  <Text className="aktiv" size="xs" color="gray">Connected with,</Text>
                  <Anchor color={colorScheme === 'dark' ? 'white' : 'black'} target="_blank" style={{ fontWeight: 900, fontSize: 21, textDecoration: "none" }} weight={700} rel="noopener noreferrer" href={`https://polygonscan.com/address/${address}`}>
                    {ens || truncate(address, 8)}
                  </Anchor>
                  <Text size="xs" color="gray">
                    {address}
                  </Text>
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-center sm:mt-0">
              {props.userAccount ? <AccountPicker 
                accountNames={props.accountNames} 
                initialValue={props.userAccount}
              /> :
                <Skeleton width="70%" height={50} />
              }
            </div>
          </div>
        <Tabs 
          setView={props.setView}
          view={props.view}
          tabs={tabs}
        />
      </Paper>
    </section>
  );
}